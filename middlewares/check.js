//  权限设置，是否登录
module.exports = {
  checkLogin: function checkLogin(req, res, next) {
    // req.session.user为false
    if (!req.session.user) {
      req.flash('error', '未登录')
      // 提示未登录，重新加载到登录页面
      return res.redirect('/signin')
    }
    next()
  },

  checkNotLogin: function checkNotLogin(req, res, next) {
    if (req.session.user) {
      req.flash('error ', '已登录')
      // 提示登录，返回之前页面
      return res.redirect('back')//返回之前的页面
    }

    next()
  }

}
