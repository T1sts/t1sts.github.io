<span style="font-size: 40px; font-weight: bold;">组织单位</span>

<div style="text-align: right;">

date: "2024-01-07"

</div>


当需要对用户赋予某特殊权限时，可以设置一个域用户组，对这个组配置资源访问权限，再将该用户拉进这个组，这样用户就拥有了这个组的权限。同样，如果需要对指定部门用户进行统一管理，便可以设置类似集合的概念，然后把该部门的用户拉入，这样就可以对该部门的用户集中进行管理了，这个集合就是组织单位。

组织单位（OU）是一个可以将域中的用户、组和计算机等对象放入其中的容器对象，是可以指派组策略或委派管理权限的最小作用域或单元。组织单位可以统一管理组织单位中的域对象。组织单位包括但不限于如下类型的对象：**用户、计算机、工作组、打印机、安全策略**，以及其他组织单位等。在组织域环境中，经常可以看到按照部门划分的一个个组织单位。

所有组织单位在活动目录中都是 `organizationalUnit` 类的示例，所以可以通过 `(objectClass=organizationalUnit)` 或者 `（objectCategory=organizationalUnit）`

查询所有的OU：`Adfind.exe -b "dc=hack-my,dc=com" -f "(objectClass=organizationalUnit)" -dn`

将BaseDN设置为指定的组织单元，便可以查询其中指定的对象。`Adfind.exe -b "OU=科研中心,DC=hack-my,DC=com" -dn` ，即可查询“科研中心”的对象