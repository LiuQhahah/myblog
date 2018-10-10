const sha1 = require('sha1')

const express = require('express')
const router = express.Router()

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

// 一个是GET一个是POST
// GET /signin 登录页
router.get('/',checkNotLogin, function (req, res, next) {
  res.render('signin')
})

// POST /signin 用户登录  不需要登录地权限 点击登录按钮后的反应
router.post('/', checkNotLogin, function (req, res, next) {
  // 获取前端地用户名与密码，并且长度不能为0
  const name  = req.fields.name
  const password = req.fields.password

  // 校验参数
  try{
    if (!name.length) {
      throw new Error('请填写用户名')
    }
    if (!password.length) {
      throw new Error('请填写密码')
    }
  } catch(e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  // 验证数据库中是否存在输入的用户名信息
  UserModel.getUserByName(name)
    .then(function (user) {
      if (!user) {
        req.flash('error', '用户不存在')
        return res.redirect('back')
      }
      // 检查密码是否匹配
      // 如果用户名存在，验证密码是否相等
      if (sha1(password) !== user.password) {
        req.flash('error', '用户名或密码错误')
        return res.redirect('back')
      }

      req.flash('success', '登录成功')
      // 用户信息写入 session
      delete user.password
      req.session.user = user
      // 跳转到主页
      // 登录成功后加载到'posts'中
      res.redirect('/posts')
    })
    .catch(next)
})

module.exports = router
