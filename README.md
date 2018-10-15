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


### 6 文章，发表，更改，提交，删除

1. post-content.ejs



左边为作者头像，点击会进入到作者主页同时鼠标浮动，显示作者信息，名称，性别与简介

文章的标题

文章内容


创建时间，浏览数，留言数  鼠标点击后的`删除，编辑选项`

2. comments.ejs


评论的作者的头像， 作的名称，留言创建的时间，


评论内容

如果当前用户是留言者本人，那么会出现`删除`选项


留言框以及提交按钮



3. 数据库 Post 与 Comment


在mongo中，创建Post，包含的参数 `作者`，`标题`，`内容`，`浏览数` 

> 除了以上参数以外，Post还通过mongolass库创建了`created_at`参数，用来表示创建的日期。



其中作者使用的id是mongolass.Types.ObejectId,内容，标题为string，浏览数为number


Comment包含作者，内容以及文章的Id，作者与文章id均使用mongolass.Types.ObjectId


利用导出有多个参数：`create`, `getPostById`, `getPosts`,`invPv`,`getRawPostById`,`updatePostById`,`delPostById`
以上参数对应一个方法：

models/posts.js中的方法作为一个中间层，供后端的逻辑调用，同时调用用mongodb创建的对象中的mongolass的方法，进行数据库创建，查询等。同时还可以在mongo.js中，创建自己的方法如添加`addCreateAt`，返回创建的时间

甚至可以在当前文件中调用自己创建的函数，比如将内容转化为html的函数 `contentToHtml`和`addCommentsCount`

4. 后端，数据的获取


如何获取一篇完整文章，包含作者信息，文章内容，评论内容，留言区域。
获取文章信息，在`posts.js`中，get方法`/:postId`。根据id获取文章信息，得到数据对象ppost，包含了文章作者，内容，标题，浏览数，创建时间，执行浏览数加1的操作。浏览数加1的实现：在根据同样的id获取评论数据对象，包含评论的作者，内容，文章id，在后台获取后，通过`render`方法将文章与评论传到前端进行显示。文章post包含内容，作者，浏览量，Id等多个参数。comments也包含了作者，内容以及文章id，所以传到前端的更像是两个对象。

其中then 的参数为回掉函数返回的结果。返回的结果就是数据进行查询文章，查询评论以及添加浏览数的执行函数。


5. 前端，数据的显示以及页面显示


posts.ejs对render的对象进行for循环。读出每一篇文章的内容

comments.ejs 显示的是所有的评论，所以就在commments中进行for循环，同时显示作者的头像，不显示介绍。
对于当前页面的User的恩与评论的User还可以删除评论

> 修改：对于鼠标浮动在`评论`作者时，显示作者信息的功能。

### 文章的 更新，删除，

1. 以下情况可以进行`删除`与`编辑`才会显示


前端：



用户名不为空即当前为登录状态& 文章的作者的id不为空 & 文章作者的id的string与当前用户的id相等

编辑与删除的路径为`href="/posts/<%= post._id%>/edit"`,`"/posts/<%= post._id%>/remove"`




后端：

重新编辑先使用的是get('/:postId/edit')，获取文章的id，以及user的id。调用数据库中的函数，获取原生的文章即markdown格式的文件，然后重新加载`edit.ejs`，表单的方法为post，action的路径为`/posts/<%= post._id%>/edit`，来到`post('/:postId/edit')`，获取文章的id,作者的id,文章的标题，文章的内容。先获取原始文章，然后在调用方法`updatePostById`，将标题与内容作为参数传过去。如果成功通过提示栏告诉`编辑文章成功`，并重新加载。


删除`get('/:postId/remove')`获取文章id与userid，首先获取原生的文章，调用model中的delete函数，成功后，通过通知栏显示 `删除文章成功`，加载返回到`/posts`。对于删除文章，不仅要删除文章内容，还有附带的留言，调用res.result.n的个数，循环删除评论内容。


### 数据库的使用：查询，执行，删除，添加，更改

1. 数据库的连接
在配置信息中 `defalut.js`，通过`module.exports`导出字符的方式设置mongodb的路径名。端口号以及数据库名称。   

调用`mongolass`第三方库，通过`connect`方式，连接数据库。   


2. 创建存储信息

通过mongoladd的方法`model`方式创建，第一个变量是存储表，第二个变量是`schema`，规定设置存储信息的信息，并通过module.export导出字段信息。分别为`exports.User`，


>  [exports 与module.export的区别](https://stackoverflow.com/questions/43397761/what-is-the-difference-between-module-export-and-export/43398667#43398667)。在javascript中有export而在node中只有exports


总的来说，exports作用准备导出，但是真正整体导出的是module.exports

[导出函数的两种方式] (https://stackoverflow.com/questions/31113498/what-is-the-best-practice-of-exports-function-in-nodejs)


导入文件中的一个方法
``` js

require('../user.js').UserService
```

```javascript (user.js)

module.exports.UserService = (function () {
return {
      getUser:getUser
}
})()
```

导入整个文件
 ``` js
 var CommentModel = require('../comment.js')


 CommentModel.create(...)
 ```

 ``` js  comment.js
 module.export = {
   create: function create(comment) {
     return ....
   },

   getCommentById: function getCommentById (commentId) {

   }
 }
 
 ```
 3. 对表进行配置方案schema

 调用mongolass的model方法，设置schema User如下字段: name ,password,avatar, gender,bio。分别对应着用户民，密码，头像，性别，简介等，对应的数据类型为string，同时为必须填写（页面中有红星，意味着必须填写），对于性别提供枚举数据供选择，并设置默认值


4. 数据库执行函数index，exec()
未找到？？？


5. plugin 附加的函数 ：contentToHtml   addCreatedAt

1. 将markdown 转化为html 

本论坛支持markdown格式的输入，并且可以将markdown转化为html,利用第三方库marked


2. 添加创建的时间呐
通过调用第三方库`objectid-to-timestamp`

将id转化成时间戳!!!!!!!!!!!!!!!


moment也是第三方库，根据Id将格式设定为('YYYY-MM-DD HH:mm')
设定时间格式是根据moment这个库决定的

3. 显示留言数据

创建变量，commentsCount,计算同一id下的数目

4. 显示浏览数据

incPv,每一次GET 当前的postid即加1，使用updatde ，$inc加1
