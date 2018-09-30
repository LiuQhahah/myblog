const fs = require('fs')
const path = require('path')
const sha1 = require('sha1')

const express = require('express')

// 创建一个路由对象
// 路由对象是中间件实例与路由的隔离实例
// 可以将路由看作是"迷你应用程序"，只能执行中间件和路由功能。每一个express应用都有一个内置的app路由器
// 路由的行为类似于中间件本身，因此可以将其用作app.use()的参数或者作为另一个路由的use()方法的参数
// 顶级express对象具有一个Router() 方法，用于创建新的路由对象

// 一旦创建了路由对象，就可以像应用程序一样添加中间件和HTTP方法（如：get,put等）的路由

// app.get /不同的网页请求，对于不同的网页请求又有路由/
// 以posts为例：
// 首先是127.0.0.1:3000/posts
// 然后是：posts/create(又分GET ，POST)；/posts/:postId/edit是仅在posts下才能操作。
const router=  express.Router()
const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

// 用户注册使用GET POST方式
// GET /signup 注册页
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('signup')
})

// POST /signup 用户注册
router.post('/', checkNotLogin, function (req, res, next){
  // 因为使用了处理表单及上传文件的中间件express-formidable,才会存在req.fields
  const name = req.fields.name
  const gender = req.fields.gender
  const bio = req.fields.bio
  const avatar = req.files.avatar.path.split(path.sep).pop()
  let password = req.fields.password
  const repassword = req.fields.repassword

  // 要求最小8个字符，包含字母，数字，以及特殊字符
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;


  // 校验参数
  try{
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字请限制在 1-10 个字符之间')
    }

    if(['m','f','x'].indexOf(gender) === -1) {
      throw new Error('从三个性别中选择，监测到所选性别不在给定的列表中')
    }

    if(!(bio.length >= 1 && bio.length <= 30)){
      throw new Error('简介请在1-30个字数内')
    }

    if(!req.files.avatar.name) {
      throw new Error('请选择头像')
    }
    // 要求最小8个字符，包含字母，数字，以及特殊字符
    if(!regex.test(password)) {
      throw new Error(' 要求最小8个字符，包含字母，数字，以及特殊字符')
    }
    console.log('password: ' + password + '\n'+
                'repassword: ' + repassword)
    if(repassword !== password) {
      throw new Error('两次密码不一致' + '\n' + password + '\n' + repassword)
    }
  } catch(e){
    // 注册失败，异步删除上传的头像
    fs.unlink(req.files.avatar.path)
    req.flash('error', e.message)

    return res.redirect('/signup')
  }

  // 明文密码加密
  password = sha1(password)

  //待写入数据库的用户信息
  let user = {
    name: name,
    password: password,
    gender: gender,
    bio: bio,
    avatar: avatar
  }

  // 将用户信息导入数据库
  UserModel.create(user)
    .then(function(result) {
      // 此user 是插入 mongodb 后的值，包含 _id
      user = result.ops[0]

      console.log('user: ' + user)
      // 删除密码敏感信息，将用户信息存入session
      delete user.password
      req.session.user = user
      // 写入flash
      req.flash('success', '注册成功')
      // 跳转到首页

      res.redirect('/posts')
    })
    .catch(function (e) {
      //注册失败，异步删除上传的头像
      fs.unlink(req.files.avatar.path)
      // 用户名被占用则跳回注册页，而不是错误页
      if (e.message.match('duplicate key')) {
        req.flash('error', '用户名已被占用')
        return res.redirect('/signup')
      }
      next(e)
    })

})

module.exports = router
