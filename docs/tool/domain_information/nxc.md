## 参数说明

```bash
┌──(kali㉿kali)-[~/Desktop]
└─$ ./nxc -h       
[*] First time use detected
[*] Creating home directory structure
[*] Creating missing folder logs
[*] Creating missing folder modules
[*] Creating missing folder protocols
[*] Creating missing folder workspaces
[*] Creating missing folder obfuscated_scripts
[*] Creating missing folder screenshots
[*] Copying default configuration file
usage: nxc [-h] [-t THREADS] [--timeout TIMEOUT] [--jitter INTERVAL] [--no-progress] [--verbose] [--debug] [--version]
           {mssql,ftp,ssh,rdp,smb,wmi,vnc,winrm,ldap} ...

     .   .
    .|   |.     _   _          _     _____
    ||   ||    | \ | |   ___  | |_  | ____| __  __   ___    ___
    \\( )//    |  \| |  / _ \ | __| |  _|   \ \/ /  / _ \  / __|
    .=[ ]=.    | |\  | |  __/ | |_  | |___   >  <  |  __/ | (__
   / /ॱ-ॱ\ \   |_| \_|  \___|  \__| |_____| /_/\_\  \___|  \___|
   ॱ \   / ॱ
     ॱ   ॱ

    The network execution tool
    Maintained as an open source project by @NeffIsBack, @MJHallenbeck, @_zblurx
    
    For documentation and usage examples, visit: https://www.netexec.wiki/

    Version : 1.1.0
    Codename: nxc4u
    

选项:
  -h, --help            显示此帮助消息并退出
  -t THREADS            设置要使用的并发线程数（默认值：100）
  --timeout TIMEOUT     每个线程的最大超时（以秒为单位）（默认值：无）
  --jitter INTERVAL     设置每个连接之间的随机延迟（默认值：无）
  --no-progress         扫描期间不显示进度条
  --verbose             启用详细输出
  --debug               启用调试级别信息
  --version             显示nxc版本

协议:
  可用协议

  {mssql,ftp,ssh,rdp,smb,wmi,vnc,winrm,ldap}
    mssql               own stuff using MSSQL
    ftp                 own stuff using FTP
    ssh                 own stuff using SSH
    rdp                 own stuff using RDP
    smb                 own stuff using SMB
    wmi                 own stuff using WMI
    vnc                 own stuff using VNC
    winrm               own stuff using WINRM
    ldap                own stuff using LDAP

```

### SMB模块

```bash
┌──(kali㉿kali)-[~/Desktop]
└─$ ./nxc smb -h
usage: nxc smb [-h] [-id CRED_ID [CRED_ID ...]] [-u USERNAME [USERNAME ...]] [-p PASSWORD [PASSWORD ...]] [--ignore-pw-decoding] [-k] [--no-bruteforce]
               [--continue-on-success] [--use-kcache] [--log LOG] [--aesKey AESKEY [AESKEY ...]] [--kdcHost KDCHOST]
               [--gfail-limit LIMIT | --ufail-limit LIMIT | --fail-limit LIMIT] [-M MODULE] [-o MODULE_OPTION [MODULE_OPTION ...]] [-L] [--options]
               [--server {https,http}] [--server-host HOST] [--server-port PORT] [--connectback-host CHOST] [-H HASH [HASH ...]] [--delegate DELEGATE]
               [--self] [-d DOMAIN | --local-auth] [--port {139,445}] [--share SHARE] [--smb-server-port SMB_SERVER_PORT] [--gen-relay-list OUTPUT_FILE]
               [--smb-timeout SMB_TIMEOUT] [--laps [LAPS]] [--sam] [--lsa] [--ntds [{drsuapi,vss}]] [--dpapi [{nosystem,cookies} ...]] [--mkfile MKFILE]
               [--pvk PVK] [--enabled] [--user USERNTDS] [--shares] [--no-write-check] [--filter-shares FILTER_SHARES [FILTER_SHARES ...]] [--sessions]
               [--disks] [--loggedon-users-filter LOGGEDON_USERS_FILTER] [--loggedon-users] [--users [USER]] [--groups [GROUP]] [--computers [COMPUTER]]
               [--local-groups [GROUP]] [--pass-pol] [--rid-brute [MAX_RID]] [--wmi QUERY] [--wmi-namespace NAMESPACE] [--spider SHARE]
               [--spider-folder FOLDER] [--content] [--exclude-dirs DIR_LIST] [--pattern PATTERN [PATTERN ...] | --regex REGEX [REGEX ...]]
               [--depth DEPTH] [--only-files] [--put-file FILE FILE] [--get-file FILE FILE] [--append-host]
               [--exec-method {smbexec,mmcexec,wmiexec,atexec}] [--dcom-timeout DCOM_TIMEOUT] [--get-output-tries GET_OUTPUT_TRIES] [--codec CODEC]
               [--force-ps32] [--no-output] [-x COMMAND | -X PS_COMMAND] [--obfs] [--amsi-bypass FILE] [--clear-obfscripts]
               target [target ...]

位置参数:
  target                目标 IP、范围、CIDR、主机名、FQDN、包含目标列表的文件、NMap XML 或 .Nessus 文件

选项:
  -h, --help            显示此帮助消息并退出
  -id CRED_ID [CRED_ID ...]
                        用于身份验证的数据库凭证 ID
  -u USERNAME [USERNAME ...]
                        用户名或包含用户名的文件
  -p PASSWORD [PASSWORD ...]
                        密码或包含密码的文件
  --ignore-pw-decoding  解码密码文件时忽略非 UTF-8 字符
  -k, --kerberos        使用 Kerberos 身份验证
  --no-bruteforce       使用文件作为用户名和密码时不喷洒（用户1 => 密码1，用户2 => 密码2
  --continue-on-success
                        即使成功后仍继续尝试身份验证
  --use-kcache          使用 ccache 文件 (KRB5CCNAME) 中的 Kerberos 身份验证
  --log LOG             将结果导出到自定义文件中
  --aesKey AESKEY [AESKEY ...]
                        用于 Kerberos 身份验证的 AES 密钥（128 或 256 位）
  --kdcHost KDCHOST     域控制器的 FQDN。 如果省略，它将使用目标参数中指定的域部分 (FQDN)
  --gfail-limit LIMIT   全局登录尝试失败的最大次数
  --ufail-limit LIMIT   每个用户名的最大失败登录尝试次数
  --fail-limit LIMIT    每台主机的最大失败登录尝试次数
  -M MODULE, --module MODULE
                        使用的模块
  -o MODULE_OPTION [MODULE_OPTION ...]
                        模块选项
  -L, --list-modules    列出可用模块
  --options             显示模块选项
  --server {https,http}
                        使用选定的服务器（默认：https）
  --server-host HOST    绑定服务器的IP（默认：0.0.0.0）
  --server-port PORT    在指定端口启动服务器
  --connectback-host CHOST
                        远程系统连接回的IP（默认：与服务器主机相同）
  -H HASH [HASH ...], --hash HASH [HASH ...]
                        NTLM 哈希值或包含 NTLM 哈希值的文件
  --delegate DELEGATE   使用 S4U2Self + S4U2Proxy 模拟用户
  --self                只做S4U2Self，不做S4U2Proxy（与委托一起使用）
  -d DOMAIN             进行身份验证的域
  --local-auth          对每个目标进行本地身份验证
  --port {139,445}      SMB 端口（默认：445）
  --share SHARE         指定份额（默认：C$）
  --smb-server-port SMB_SERVER_PORT
                        指定 SMB 的服务器端口
  --gen-relay-list OUTPUT_FILE
                        将不需要 SMB 签名的所有主机输出到指定文件
  --smb-timeout SMB_TIMEOUT
                        SMB连接超时，默认2秒
  --laps [LAPS]         LAPS认证

凭证收集:
  收集凭据的选项

  --sam                 从目标系统转储 SAM 哈希值
  --lsa                 从目标系统转储 LSA 秘密
  --ntds [{drsuapi,vss}]
                        使用指定的方法从目标 DC 转储 NTDS.dit（默认：drsuapi）
  --dpapi [{nosystem,cookies} ...]
                        从目标系统转储 DPAPI 机密，如果添加“cookies”，则可以转储 cookie，如果添加 nosystem，则不会转储 SYSTEM dpapi

证书收集:
  收集凭据的选项

  --mkfile MKFILE       DPAPI 选项。 包含 {GUID}:SHA1 形式的主密钥的文件
  --pvk PVK             DPAPI 选项。 带有域备份密钥的文件
  --enabled             仅从 DC 转储启用的目标
  --user USERNTDS       从 DC 转储选定的用户

映射/枚举:
  映射/枚举选项

  --shares              枚举共享和访问
  --no-write-check      跳过对共享的写入检查（避免在缺少删除权限时留下痕迹）
  --filter-shares FILTER_SHARES [FILTER_SHARES ...]
                        按访问权限、选项“读”、“写”或“读、写”过滤共享
  --sessions            枚举活动会话
  --disks               枚举磁盘
  --loggedon-users-filter LOGGEDON_USERS_FILTER
                        仅搜索特定用户，与正则表达式一起使用
  --loggedon-users      枚举登录用户
  --users [USER]        枚举域用户，如果指定了用户，则仅查询其信息。
  --groups [GROUP]      枚举域组，如果指定了组，则枚举其成员
  --computers [COMPUTER]
                        枚举计算机用户
  --local-groups [GROUP]
                        枚举本地组，如果指定了组，则枚举其成员
  --pass-pol            转储密码策略
  --rid-brute [MAX_RID]
                        通过暴力破解 RID 来枚举用户（默认值：4000）
  --wmi QUERY           发出指定的 WMI 查询
  --wmi-namespace NAMESPACE
                        WMI 命名空间（默认：root\cimv2）

爬行:
  爬行共享的选项

  --spider SHARE        分享给爬行
  --spider-folder FOLDER
                        到爬行的文件夹（默认：根共享目录）
  --content             启用文件内容搜索
  --exclude-dirs DIR_LIST
                        从爬行抓取中排除的目录
  --pattern PATTERN [PATTERN ...]
                        在文件夹、文件名和文件内容中搜索的模式
  --regex REGEX [REGEX ...]
                        用于在文件夹、文件名和文件内容中搜索的正则表达式
  --depth DEPTH         最大爬行递归深度（默认值：无穷大及以上）
  --only-files          仅爬行文件

文件:
  放置和获取远程文件的选项

  --put-file FILE FILE  将本地文件放入远程目标，例如：whoami.txt \\Windows\\Temp\\whoami.txt
  --get-file FILE FILE  获取远程文件，例如：\\Windows\\Temp\\whoami.txt whoami.txt
  --append-host         将主机附加到 get-file 文件名

命令执行:
  执行命令的选项

  --exec-method {smbexec,mmcexec,wmiexec,atexec}
                        方法来执行命令。 如果处于 MSSQL 模式则忽略（默认值：wmiexec）
  --dcom-timeout DCOM_TIMEOUT
                        DCOM连接超时，默认5秒
  --get-output-tries GET_OUTPUT_TRIES
                        atexec/smbexec/mmcexec 尝试获取结果的次数，默认为 5
  --codec CODEC         设置目标输出中使用的编码（编解码器）（默认值：utf-8）。 如果检测到错误，请在目标处运行 chcp.com 并将结果映射到 https://docs.python.org/3/library/codecs.html#standard-encodings，然后使用 --codec 和相应的编解码器再次执行
  --force-ps32          强制 PowerShell 命令在 32 位进程中运行
  --no-output           不获取命令输出
  -x COMMAND            执行指定的CMD命令
  -X PS_COMMAND         执行指定的PowerShell命令

Powershell混淆:
  PowerShell 脚本混淆的选项

  --obfs                混淆 PowerShell 脚本
  --amsi-bypass FILE    具有自定义 AMSI 绕过的文件
  --clear-obfscripts    清除所有缓存的混淆 PowerShell 脚本

```

### wmi模块

```bash
┌──(kali㉿kali)-[~/Desktop]
└─$ ./nxc wmi -h
usage: nxc wmi [-h] [-id CRED_ID [CRED_ID ...]] [-u USERNAME [USERNAME ...]] [-p PASSWORD [PASSWORD ...]] [--ignore-pw-decoding] [-k] [--no-bruteforce]
               [--continue-on-success] [--use-kcache] [--log LOG] [--aesKey AESKEY [AESKEY ...]] [--kdcHost KDCHOST]
               [--gfail-limit LIMIT | --ufail-limit LIMIT | --fail-limit LIMIT] [-M MODULE] [-o MODULE_OPTION [MODULE_OPTION ...]] [-L] [--options]
               [--server {https,http}] [--server-host HOST] [--server-port PORT] [--connectback-host CHOST] [-H HASH [HASH ...]] [--port {135}]
               [--rpc-timeout RPC_TIMEOUT] [-d DOMAIN | --local-auth] [--wmi QUERY] [--wmi-namespace NAMESPACE] [--no-output] [-x COMMAND]
               [--exec-method {wmiexec,wmiexec-event}] [--exec-timeout exec_timeout] [--codec CODEC]
               target [target ...]

positional arguments:
  target                the target IP(s), range(s), CIDR(s), hostname(s), FQDN(s), file(s) containing a list of targets, NMap XML or .Nessus file(s)

options:
  -h, --help            show this help message and exit
  -id CRED_ID [CRED_ID ...]
                        database credential ID(s) to use for authentication
  -u USERNAME [USERNAME ...]
                        username(s) or file(s) containing usernames
  -p PASSWORD [PASSWORD ...]
                        password(s) or file(s) containing passwords
  --ignore-pw-decoding  Ignore non UTF-8 characters when decoding the password file
  -k, --kerberos        Use Kerberos authentication
  --no-bruteforce       No spray when using file for username and password (user1 => password1, user2 => password2
  --continue-on-success
                        continues authentication attempts even after successes
  --use-kcache          Use Kerberos authentication from ccache file (KRB5CCNAME)
  --log LOG             Export result into a custom file
  --aesKey AESKEY [AESKEY ...]
                        AES key to use for Kerberos Authentication (128 or 256 bits)
  --kdcHost KDCHOST     FQDN of the domain controller. If omitted it will use the domain part (FQDN) specified in the target parameter
  --gfail-limit LIMIT   max number of global failed login attempts
  --ufail-limit LIMIT   max number of failed login attempts per username
  --fail-limit LIMIT    max number of failed login attempts per host
  -M MODULE, --module MODULE
                        module to use
  -o MODULE_OPTION [MODULE_OPTION ...]
                        module options
  -L, --list-modules    list available modules
  --options             display module options
  --server {https,http}
                        use the selected server (default: https)
  --server-host HOST    IP to bind the server to (default: 0.0.0.0)
  --server-port PORT    start the server on the specified port
  --connectback-host CHOST
                        IP for the remote system to connect back to (default: same as server-host)
  -H HASH [HASH ...], --hash HASH [HASH ...]
                        NTLM hash(es) or file(s) containing NTLM hashes
  --port {135}          WMI port (default: 135)
  --rpc-timeout RPC_TIMEOUT
                        RPC/DCOM(WMI) connection timeout, default is 2 seconds
  -d DOMAIN             Domain to authenticate to
  --local-auth          Authenticate locally to each target

Mapping/Enumeration:
  Options for Mapping/Enumerating

  --wmi QUERY           Issues the specified WMI query
  --wmi-namespace NAMESPACE
                        WMI Namespace (default: root\cimv2)

Command Execution:
  Options for executing commands

  --no-output           do not retrieve command output
  -x COMMAND            Creates a new cmd process and executes the specified command with output
  --exec-method {wmiexec,wmiexec-event}
                        method to execute the command. (default: wmiexec). [wmiexec (win32_process + StdRegProv)]: get command results over registry
                        instead of using smb connection. [wmiexec-event (T1546.003)]: this method is not very stable, highly recommend use this method in
                        single host, using on multiple hosts may crash (just try again if it crashed).
  --exec-timeout exec_timeout
                        Set timeout (in seconds) when executing a command, minimum 5 seconds is recommended. Default: 5
  --codec CODEC         Set encoding used (codec) from the target's output (default: utf-8). If errors are detected, run chcp.com at the target & map the
                        result with https://docs.python.org/3/library/codecs.html#standard-encodings and then execute again with --codec and the
                        corresponding codec

```