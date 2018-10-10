const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET /signout 登出  只有登录成功后，才能进行的操作
router.get('/', checkLogin, function(req, res, next) {
  // 清空session中的用户信息
  // 注销就是把session中的信息设置为null,然后重新加载
  req.session.user = null
  req.flash('success','注销成功')
  // 退出后，跳转到主页面
  res.redirect('/posts')
})

module.exports = router
