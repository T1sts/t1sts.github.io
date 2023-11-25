 # PHP代码审计-SQL注入篇


<div style="text-align: right;">

date: "2023-11-25"

</div>

## PHP+Mysql连接方式

1. Mysql（废弃）
2. Mysqli
3. PDO

## SQL注入漏洞常见过滤方法

1. [intval](https://www.php.net/manual/zh/function.intval.php)(PHP 4, PHP 5, PHP 7, PHP 8)：将用户传入的数据只保留数字，其余字符以及字母全部过滤掉。


```
<?php
  echo intval(123abc);                  // 123
  echo intval(42);                      // 42
  echo intval(4.2);                     // 4
  echo intval('42');                    // 42
  echo intval('+42');                   // 42
  echo intval('-42');                   // -42
  echo intval(042);                     // 34
  echo intval('042');                   // 42
  echo intval(1e10);                    // 10000000000
  echo intval('1e10');                  // 10000000000
  echo intval(0x1A);                    // 26
  echo intval('0x1A');                  // 0
  echo intval('0x1A', 0);               // 26
  echo intval(42000000);                // 42000000
  echo intval(420000000000000000000);   // -4275113695319687168
  echo intval('420000000000000000000'); // 9223372036854775807
  echo intval(42, 8);                   // 42
  echo intval('42', 8);                 // 34
  echo intval(array());                 // 0
  echo intval(array('foo', 'bar'));     // 1
  echo intval(false);                   // 0
  echo intval(true);                    // 1
?>
```

2. [addslashes](https://www.php.net/manual/zh/function.addslashes)(PHP 4, PHP 5, PHP 7, PHP 8)：将字符`'`、`"`、`\`、`NUL`以反斜线转义，过滤SQL注入

```
<?php 
	echo addslashes(');                 // \'
    echo addslashes(");                 // \"
    echo addslashes(\);                 // \\
    echo addslashes(NUL);               // 未知，但也被转义
?>
```

3. [mysql_real_escape_string](https://www.php.net/manual/zh/function.mysql-real-escape-string)(PHP 4 >= 4.3.0, PHP 5,本扩展自 PHP 5.5.0 起已废弃，并在自 PHP 7.0.0 开始被移除)：将字符串中的`'`、`"`、`\`、`NUL`以反斜线转义，以在 SQL 语句中使用

```
<?php

// 假设你已经连接到数据库
$connection = mysql_connect("127.0.0.1", "root", "root");
mysql_select_db("example", $connection);

// 获取用户输入
$order = $_GET['order'];

// 使用 mysql_real_escape_string 处理用户输入
$escapedUserInput = mysql_real_escape_string($order);
echo $escapedUserInput;
echo "</br>";

// 构造 SQL 查询
$query = "SELECT name, age, email, country FROM user_details ORDER BY id {$escapedUserInput};";

// 执行查询
$result = mysql_query($query);

// 检查查询是否成功
if (!$result) {
    die('Query failed: ' . mysql_error());
}

// 处理查询结果...
while ($row = mysql_fetch_assoc($result)) {
    echo $row['email'] . "<br>";
}

// 关闭数据库连接
mysql_close($connection);


?>

输出：和addslashes函数处理过的结果一致


```

4. [mysqli_escape_string / mysqli_real_escape_string / mysqli::escape_string](https://www.php.net/manual/zh/function.mysqli-escape-string.php)(PHP 5, PHP 7, PHP 8)：将字符`'`、`"`、`\`、`NUL`以反斜线转义，过滤SQL注入


5. [PDO::quote](https://www.php.net/manual/zh/pdo.quote)(PHP 5 >= 5.1.0, PHP 7, PHP 8, PECL pdo >= 0.2.1)：为 SQL 查询里的字符串添加引号，返回加引号的字符串


```
<?php
$conn = new PDO('sqlite:/home/lynn/music.sql3');

/* 危险字符串 */
$string = 'Naughty \' string';
print "Unquoted string: $string\n";
print "Quoted string:" . $conn->quote($string) . "\n";

?>

打印结果：
Unquoted string: Naughty ' string
Quoted string: 'Naughty '' string'

```

6. 参数化查询：暂未了解

## 常见过滤绕过方法

- intval
- addslashes / mysql_real_escape
   - 宽字节注入
   - 寻找字符串转换函数
      - urldecode
      - base64_decode
      - iconv
      - json_decode
      - stripshasles
      - simple_xml_loadstring
- mysqli::escape_string / PDO::quote
   - 与addslashes差别：是否会主动加引号包裹
   - 宽字符注入
- 参数化查询
   - 寻找非SQL值位置
   - `SELECT 'name' FROM 'users' WHERE 'id' = ? ORDER BY 'login_time' LIMIT 1`

## 开发者容易遗漏的输入点

- HTTP头
   - X-Forwarded-For
   - User-Agent
   - Referer
- PHP_SELF
- REQUEST_URI
- 文件名$_FILES[][name]
- php://input

引入单引号（转义符的方法）

1. stripslashes
2. base64_decode
3. urldecode
4. substr
5. iconv
6. str_replace('0',",$sql)
7. xml
8. json_encode

## SQL注入代码审计练习

#### 数据库创建语句
```
-- 创建数据库
CREATE DATABASE example;

-- 创建表格
CREATE TABLE `example`.`user_details` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(256) NOT NULL,
    `email` VARCHAR(256) NOT NULL,
    `age` INT NULL,
    `country` VARCHAR(128) NULL,
    PRIMARY KEY (`id`)
) ENGINE = MyISAM;

-- 插入数据
INSERT INTO user_details (id, name, email, age, country) VALUES ('1', 'Bob', 'bob@example.com', '22', 'China');
INSERT INTO user_details (id, name, email, age, country) VALUES ('2', 'Zhang', 'zhang@example.com', '25', NULL);

```

#### common.php

```
<?php
try {
    $dbhost = "localhost";
    $dbname = 'example';
    $dbuser = 'root';
    $dbpass = 'root';
    $option = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ];
    $conn = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass, $option);
} catch (PDOException $e) {
    echo "Error：" . $e->getMessage() . "<br/>";
    die();
}
?>

```

#### SQL注入代码审计-1

```
<?php
include_once './common.php';
highlight_file(__FILE__);

try {
    $name = $_GET['name'];
    $query = "SELECT name, age, email, country FROM user_details WHERE name = '{$name}';";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $stmt->bindColumn('email', $email);

    while ($row = $stmt->fetch(PDO::FETCH_BOUND)) {
        echo "$email" . "<br>";
    }
} catch (PDOException $e) {
    echo $e->getMessage();
}
?>

```

在上述代码中存在很明显的SQL注入漏洞，对用户传入的参数没有进行过滤直接拼接到SQL语句中

#### SQL注入代码审计-2

```
<?php
include_once 'common.php';
highlight_file(__FILE__);

try {
    $name = addslashes($_GET['name']);
    $query = "SELECT name, age, email, country FROM user_details WHERE name = '{$name}';";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $stmt->bindColumn('email', $email);

    while ($row = $stmt->fetch(PDO::FETCH_BOUND)) {
        echo "$email" . "<br>";
    }
} catch (PDOException $e) {
    echo $e->getMessage();
}
?>

```

在上述代码中不存在SQL注入漏洞，宽字节注入是针对GBK或者宽字节编码的才存在，在UTF-8下不存在

#### SQL注入代码审计-3
```
<?php
include_once 'common.php';
highlight_file(__FILE__);

try {
    $name = htmlspecialchars($_GET['name']);
    $query = "SELECT name, age, email, country FROM user_details WHERE name = '{$name}';";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $stmt->bindColumn('email', $email);

    while ($row = $stmt->fetch(PDO::FETCH_BOUND)) {
        echo "$email" . "<br>";
    }
} catch (PDOException $e) {
    echo $e->getMessage();
}
?>

```

在上述代码中存在SQL注入漏洞，[htmlspecialchars](https://www.php.net/manual/zh/function.htmlspecialchars.php)的作用是将特殊字符转换为 HTML 实体，是为了预防XSS漏洞，也可以转义单引号和双引号，但是需要在参数中设置，也就是更改如下所示：

```
$name = htmlspecialchars($_GET['name'],ENT_QUOTES);
```

| 常量名称 | 描述 |
| --- | --- |
| ENT_COMPAT | 会转换双引号，不转换单引号。 |
| ENT_QUOTES | 既转换双引号也转换单引号。 |

#### SQL注入代码审计-4

```
<?php
include_once 'common.php';
highlight_file(__FILE__);

try {
    $age = addslashes($_GET['age']);
    $query = "SELECT name, age, email, country FROM user_details WHERE age > {$age};";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $stmt->bindColumn('email', $email);

    while ($row = $stmt->fetch(PDO::FETCH_BOUND)) {
        echo "$email" . "<br>";
    }
} catch (PDOException $e) {
    echo $e->getMessage();
}
?>

```

在上述代码中存在SQL注入漏洞，因为数值型SQL注入不需要使用单双引号来进行闭合，将数字型的值使用单引号包裹起来即可修复：

```
$query = "SELECT name, age, email, country FROM user_details WHERE age > '{$age}';";
```

#### SQL注入代码审计-5

```
<?php
include_once 'common.php';
highlight_file(__FILE__);

try {
    $name = str_replace("'", "\\'", $_GET['name']);
    $query = "SELECT name, age, email, country FROM user_details WHERE name = '{$name}';";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $stmt->bindColumn('email', $email);

    while ($row = $stmt->fetch(PDO::FETCH_BOUND)) {
        echo "$email" . "<br>";
    }
} catch (PDOException $e) {
    echo $e->getMessage();
}
?>

```

在上述代码中存在SQL注入漏洞，[str_replace](https://www.php.net/manual/zh/function.str-replace)函数是将指定的字符替换为另一个字符，在此处是将`'`替换为`\\'`，可以通过如下方式进行绕过：

```
http://192.168.36.130:81/sql5.php?name=Zhang\'
```

#### SQL注入代码审计-6
```
<?php
include_once 'common.php';
highlight_file(__FILE__);

try {
    $id = intval($_GET['id']);
    $query = "SELECT name, age, email, country FROM user_details WHERE id = {$id};";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $stmt->bindColumn('email', $email);

    while ($row = $stmt->fetch(PDO::FETCH_BOUND)) {
        echo "$email" . "<br>";
    }
} catch (PDOException $e) {
    echo $e->getMessage();
}
?>

```
在上述代码中不存在SQL注入漏洞

#### SQL注入代码审计-7

```
<?php
include_once 'common.php';
highlight_file(__FILE__);

try {
    $id = intval($_GET['id']);
    $query = "SELECT name, age, email, country FROM user_details WHERE id = {$_GET['id']};";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $stmt->bindColumn('email', $email);

    while ($row = $stmt->fetch(PDO::FETCH_BOUND)) {
        echo "$email" . "<br>";
    }
} catch (PDOException $e) {
    echo $e->getMessage();
}
?>

```
在上述代码中存在SQL注入漏洞，SQL语句没有使用转义后的$id，而是使用用户传入的原始参数

#### SQL注入代码审计-8
```
<?php
include_once 'common.php';
highlight_file(__FILE__);

try {
  if (!is_numeric($_GET['id'])){
    header("Status: 404 Not found");
  }
  
    $query = "SELECT name, age, email, country FROM user_details WHERE id = {$_GET['id']};";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $stmt->bindColumn('email', $email);

    while ($row = $stmt->fetch(PDO::FETCH_BOUND)) {
        echo "$email" . "<br>";
    }
} catch (PDOException $e) {
    echo $e->getMessage();
}
?>

```
在上述代码中存在SQL注入漏洞，因为只给了提示404，代码没有中止，还在继续向下运行。
[is_numeric](https://www.php.net/manual/zh/function.is-numeric)：检测变量是否为数字或数字字符串，变量为数字或数字字符串则返回 true，否则返回 false。

#### SQL注入代码审计-9

```
<?php
include_once 'common.php';
highlight_file(__FILE__);

try {
  if (!is_numeric($_GET['id'])){
    header("Status: 404 Not found");
    exit;
  }
  
    $query = "SELECT name, age, email, country FROM user_details WHERE id = {$_GET['id']};";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $stmt->bindColumn('email', $email);

    while ($row = $stmt->fetch(PDO::FETCH_BOUND)) {
        echo "$email" . "<br>";
    }
} catch (PDOException $e) {
    echo $e->getMessage();
}
?>

```

在上述代码中不存在SQL注入漏洞

#### SQL注入代码审计-10

```
<?php
include_once './common.php';
highlight_file(__FILE__);

try {
    $order = addslashes($_GET['order']);
    
    $query = "SELECT name, age, email, country FROM user_details ORDER BY id {$order};";
    $stmt = $conn->prepare($query);
    $stmt->execute();
  
    $stmt->bindColumn('email', $email);

    while ($row = $stmt->fetch(PDO::FETCH_BOUND)) {
        echo "$email" . "<br>";
    }
} catch (PDOException $e) {
    echo $e->getMessage();
}
?>

```
在上述代码中存在SQL注入漏洞,只有有值的位置才可以通过addslashes进行过滤，在此处ORDER BY id 后面的位置没有值了，存在堆叠注入

#### SQL注入代码审计-11

```
<?php
include_once './common.php';
highlight_file(__FILE__);

try {
    $order = addslashes($_GET['order']);
    
    if (!preg_match('/DESC|ASC/i', $order)) {
        exit("Bad order");
    }

    $query = "SELECT name, age, email, country FROM user_details ORDER BY id {$order};";
    $stmt = $conn->prepare($query);
    $stmt->execute();
  
    $stmt->bindColumn('email', $email);

    while ($row = $stmt->fetch(PDO::FETCH_BOUND)) {
        echo "$email" . "<br>";
    }
} catch (PDOException $e) {
    echo $e->getMessage();
}
?>

```
在上述代码中存在SQL注入漏洞，其中检查了用户传入的值是否包含“DESC”或“ASC”，但是这里只是检测是否存在匹配的字符，没有判断是否一定只能存在“DESC”或“ASC”，没有做到严格限制，传入例如：`union select 1,2,3# desc`即可绕过了该检测，注意#号，在前端中是做定位符存在的，要将其url编码后发送。
```
http://192.168.36.130:8080/11.php%3Forder%3Dunion%20select%201%2C2%2C3%23%20DESC
```
漏洞修复：增加首尾定界符，让其只能存在“DESC”或“ASC”
```
if (!preg_match('/^(DESC|ASC)$/i', $order)) {
        exit("Bad order");
    }
```

#### SQL注入代码审计-12
```
<?php
include_once 'common.php';
highlight_file(__FILE__);

try {
    $name = addslashes($_GET['name']);
    $query = "SELECT name, age, email, country FROM user_details WHERE name = ?;";
    $stmt = $conn->prepare($query);
    $stmt->bindValue(1, $name);
    $stmt->execute();
    $stmt->bindColumn('email', $email);

    while ($row = $stmt->fetch(PDO::FETCH_BOUND)) {
        echo "$email" . "<br>";
    }
} catch (PDOException $e) {
    echo $e->getMessage();
}
?>

```
在上述代码中不存在SQL注入漏洞，预编译的SQL语句

#### SQL注入代码审计-13

```
<?php
include_once './common.php';
highlight_file(__FILE__);

try {
    $name = addslashes($_GET['name']);
    $name = urldecode($name);
    $query = "SELECT name, age, email, country FROM user_details WHERE name = '{$name}';";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $stmt->bindColumn('email', $email);

    while ($row = $stmt->fetch(PDO::FETCH_BOUND)) {
        echo "$email" . "<br>";
    }
} catch (PDOException $e) {
    echo $e->getMessage();
}
?>

```
在上述代码中存在SQL注入漏洞，url编码payload即绕过了addslashes函数

```
http://192.168.36.130:81/sql13.php?name=Zhang%2527
```
