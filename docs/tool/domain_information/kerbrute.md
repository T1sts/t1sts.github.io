
# Kerbrute

<div style="text-align: right;">

date: "2023-11-05"

</div>

## 基础使用

### 域用户枚举

```shell
./kerbrute_linux_amd64 userenum -d <域名称> <待枚举的用户名>.txt
```

```shell
./kerbrute_linux_amd64 userenum --dc <域控ip> -d <域名称> <待枚举的用户名>.txt
```

### 密码喷洒

```shell
./kerbrute_linux_amd64 passwordspray --dc <域控ip> -d <域名称> <待枚举的用户名>.txt <待测试密码>
```