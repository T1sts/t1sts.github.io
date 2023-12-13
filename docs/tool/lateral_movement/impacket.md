
# impacket
<div style="text-align: right;">

date: "2023-12-10"

</div>

Impacket工具使用认证的账号rid必须为500，从winows 2008开始(包括2008)，rid不为500的用户，windows都不允许远程连接(包括net use、at、winrm等)，所以如果想对目标机远程执行命令，必须使用目标机rid 500的账号(通常为administrator)或域管账号。