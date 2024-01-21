<span style="font-size: 40px; font-weight: bold;">实验-打印机操作员组</span>

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

# 添加用户至打印机组

将上述创建的域用户 t1sts 用户添加至 `Print Operators`（打印机操作员组），并查看 `Print Operators` 的所有成员

```shell
PS C:\Users\Administrator> Add-ADGroupMember -Identity "Print Operators" -Members "h0ny"
PS C:\Users\Administrator> Get-ADGroupMember -Identity 'Print Operators'


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

`Print Operators` 成员 h0ny 横向移动失败，域管理员 administrator 横向移动成功

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
```