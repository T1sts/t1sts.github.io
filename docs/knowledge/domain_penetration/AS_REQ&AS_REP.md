# AS_REQ&AS_REP 阶段攻击

<div style="text-align: right;">

date: "2023-03-07"

</div>

## AS_REQ 阶段

### 域内用户枚举

> 在非域用户登录域内主机或主机不在域内但能与域控通信时

由于用户名存在和不存在的报错不一致，导致可以进行用户名枚举

| 错误代码    | 状态              | 说明                                        |
| ------------------------------ | -----------------------------| ------------ |
| KRB5DC_ERR_PREAUTH_REQUIRED    | 需要额外的预认证               | 用户存在 |
| KRB5DC_ERR_CLIENT_REVOKED      | 客户端凭证已被吊销             | 禁用     |
| KRB5DC_ERR_C_PRINCIPAL_UNKNOWN | 在Kerberos数据库中找不到客户端 | 不存在   |

用户名枚举实例：[这里](/docs/tool/domain_information/kerbrute.md)


### 密码喷洒攻击

> 使用一个密码去碰撞多个账号，避免账号被锁定

在确认用户存在后，客户端又会发送一个 AS-REQ 请求，如果密码正确，则返回 AS-REP。否则返回 `KRB5KDC_ERP_PREAUTH_FAILED`

密码喷洒实例：[这里](/docs/tool/domain_information/kerbrute.md)

### AS-REP Roasting攻击

> 针对 kerberos 协议的攻击技术，不需要认证就可以获取到用户 hash 加密的 `Login Session Key`，也就是 AS-REP 响应包中最外层 `ecp-part` 中的 `cipher` 部分

当被攻击账号设置 **不需要 Kerberos 预身份认证** 后，在 AS_REP 过程中就可以任意伪造用户名请求票据，随后 AS 会将伪造请求的用户名 NTLM Hash 加密后返回，获取到经过用户的 RC4-HMAC 的密码，接着就可以进行离线爆破。

该利用方式比较局限，因为 **不需要 Kerberos 预身份认证** 选项默认是未勾选的

AS-REP Roasting攻击实例：
1. [Impacket-GetNPUser](/docs/tool/domain_information/impacket-GetNPUsers.md)
2. [rebeus](/docs/tool/domain_information/rebeus.md)
3. [ASREPRoast PowerShell Script](/docs/tool/domain_information/ASREPRoast_PowerShell_Script.md)
4. [Powershell Empire](/docs/tool/domain_information/Powershell_Empire.md)

## AS_REP 阶段

### 黄金票据(Golden Ticket)

>通过伪造 `TGT` 发送给 `TGS` 换取任意服务的 `ST`，相当于拿到了域内最高权限

在 Kerberos 认证中，每个用户的票据都是由 krbtgt 的 NTLM 哈希值加密生成的，获得 krbtgt 的哈希值，便可以伪造任意用户的票据，这种攻击方式被称为黄金票据（Golden Ticket）

#### 制作黄金票据的条件

1. 域名
2. 域 SID 值
3. krbtgt 哈希值
4. 伪造的用户

#### 黄金票据的特点

1. 域控制器中的 KDC 服务不验证 TGT 中的用户帐户，直到 TGT 超过20分钟，这意味着攻击者可以使用禁用和删除的帐户，甚至是在 `Active Directory` 中不存在的虚拟帐户。
2. 由于在域控制器上由 KDC 服务生成的域设置了 Kerberos 策略，如果提供票据，则系统信任票据的有效性。这意味着，即使域策略声明 Kerberos 登录票据（TGT）只有10小时有效，如果票据声明有效期为10 年，那么也会信任票据的有效性期为10年。
3. 该 KRBTGT 帐户密码从不更改和直到 KRBTGT 密码被更改（两次），攻击者可以创建黄金票据。请注意，即使伪造用户更改其密码，创建用于模拟用户的`Golden Ticket` 仍然存在。
4. 它绕过了 `SmartCard` 身份验证要求，因为它绕过了 DC 在创建 TGT 之前执行的常规验证。
5. 这个精心创建的TGT要求攻击者拥有 `Active Directory` 域的 KRBTGT 密码哈希值（通常从域控制器转储）。
6. `KRBTGT NTLM` 哈希可用于生成一个有效的TGT（使用RC4）模拟任何用户访问 `Active Directory` 中的任何资源。
7. 在主机上都可以生成和使用黄金票据（TGT），即使没有加入域也是如此。只要网络可以访问域。
8. 用于从 AD 森林中的 DC 获取有效的 TGS 票据，并提供一个坚持在一切域访问所有的主机的好办法。

