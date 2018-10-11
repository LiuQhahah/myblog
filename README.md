## 业务逻辑描述

### 1 关于登录注册

1. 数据库信息


使用mongolass 创建"User"，存储的字段包含，用户名，密码，头像，性别以及简介。
，除性别意外，其余四项全部要求必填均为字符串类型，性别利用枚举只有三种可能。

2. 前端：页面设置

利用`form`，使用`post`提交方式，创建用户名，密码，重复密码，性别，头像，简介等输入框以及提交按钮。

用户名使用`name`,密码使用 `password`，重复密码使用 `repassword`(数据类型为password，保证输入加密),性别使用列表，三选一，变量名为`gender`，三个性别对应的数据分别为数据库中枚举中的数值。头像的参数类型为`file`，变量为`avatar`,简介的变量设置为 `bio`，标签为 `textarea`设置行数为5行。
最后使用类型为`submit`的注册input。

3. 后端：路由设置

针对`post`方式，首先通过`express-formdable`的中间件获取标单中的数据,name,gender,bio,password,repassword以及avatar对应的路径信息。

密码的要求，最小8个字符，要包含字母，数字以及特殊字符。

接下来校验参数：
对于name的长度需要为1-10之间；

性别要在['m','f','x']中的一个；

简介的长度为1-30之间；

密码使用正则表达式函数test


使用`try...catch...`，出现错误，头像路径不关联，flash提示错误，返回注册页

将明文密码利用sha1加密，成新的变量，将新的变量利用数据库中的按数，创建用户信息，
提示注册成功，并跳转到`/posts`页面

创建失败同样取消与头像路径的关联，同时如果存在用户名被占用情况，也提示错误，并且加载到`/signup`


### 2 登录功能 signin 

1. 前端 sign.ejs

利用表单`form`，输入用户名与密码，对应的变量名称为`name`.`password`,数据类型为`text`与`password`
表单的触发方式还是`post`

2. 后端，signin.js

在`post`方法中，使用中间件`express-formdable`获取表单中用户与密码信息，
判断用户名与密码的长度问题，出现异常使用catch抛出，提示错误，重新回到上一页面即登录页面

在讲之前先介绍`model`中的user函数，

获取用户名，首先验证用户名，如果用户名为空，则返回，提示用户不存在，

用户名存在后，加密后的password与用户名所在数据库中的密码是否相同，相同显示登录成功。
删除用户的用户名，以及将session中的用户名设置为登录的用户名，然后重新加载`/posts`
3. MVC 中的 M—— `model`

用户有两个函数，首先是创建`create`用户信息，以及通过用户名获取用户信息`getUserByName`


###  3 登出 signout

退出登录相对容易，只需要将session中的user置为null,后在重新加载就可以了


### 4 权限规定


操作可以分为，需要登录才可以操作，比如新建文章，更改文章，对文章留言，删除文章，退出登录。

而有一些则只有未登录才可以操作，比如登录页面，

还有一些无论是否登录都可以的 `posts`


函数变量可以分为`checkLogin`,`checkNotLogin`两种情况

1. export 语句

在check.js中，使用module.exports = {,,} 从模块导出函数，对象或原始值，以便其他程序可以通过`import`语句使用他们。


module.exports = { name： ‘name’ ， value : '23'}


导出的只有两个参数，`checkLogin`,`checkNotLogin`


2. checkLogin

赋值为 session中的user信息为true,如果为false 那么就要重新加载登录界面`signin`

3. checkNotLogin

不需要登录，如果监测到session中的user为true，那么就返回之前的页面


### 5. 头部，通知栏，以及设置栏 页脚

1. 头部

显示博客的标题，是在标签页时，显示出来

由于blog的标题是固定，所以采用全局常量。获取`packege.json`中的常量name与description
app.locals.blog = {
  title: pkg.name,
  description: pkg.description
}


2. 通知栏 <%- include ('components/nav')%>

居中显示博客的标题，同时点击跳转到`/posts`，鼠标浮动时，显示标题下有一根绿色线

以及博客的描述


3. 设置栏 nav-setting 
两种情况：用户存在时与用户未存在(游客)

所以的js代码都通过ejs的<% %>实现
如果已经登录，那么显示`个人主页`,`发表文章`,`退出登录`使用class 并伴随着对应的href

没有登录那么显示`登录`,`注册`等


4. 消息提示栏 notification
只有两种情况，成功与失败

登录成功：success，在后端讲数据传到success中，并将登录成功的字符串输出


函数flash()，两个参数
`req.flash('success','登录成功')
req.flash('error',用户名不存在')`


使用if.来判断，因为只要是正确，就传参，不为空就显示

5. 页角footer.ejs


函数具体解释见footer.ejs 

实现两个功能，点击图标弹出下来框

鼠标悬浮，弹出气泡提示框


