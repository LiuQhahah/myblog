module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/posts')
  })

  // app.use([path,] callback [,callback...]):
  // 在指定的path上挂载指定的middleware function 或 function：
  // 当请求的path与所需的path匹配时，执行middleware function。
  // 比如路径为'127.0.0.1:3000/signup'时，就执行require('./signup')
  // 关于挂载路径的问题，路由对于输入的路径匹配不是严格的相等，而是只要前面的路径相等就执行middleware function
  // 比如： app.use('/apple',...) 均可以与"/apple","/apple/images"以及"apple/images/news"匹配
  // 注意/后的一定要一致，/apple/images 与/apple/images/news 第一层均为/apple

  // 中间层函数位置也非常重要，
  // 比如 先写了
  // app.use(function (req, res, next){ res.send('Hello World');}); 意味着匹配全部，均执行 function 中的内容，
  // 下面的代码永远不会执行
  // 接下来的请求不会执行

  // app.use('/', function (req, res, next) { res.send('Welcome');});


  // 异常处理的中间层
  // 异常处理的中间层总是有4个参数，即使不需要 next 参数，也要填上去，否则 next 对象会被认为是正常的中间层，而不是异常处理中间层
  // 具体的代码如下：
  // app.use (function (err, req, res, next)
  // {console.error(err.stack); res.status(500).send('Something broke!');});


  // 关于path的匹配路径，路径模式:
  // abc?d 将会匹配以'/abcd'或'abd'开头的请求
  // app.use('/abc?d', function (req, res, next) {
  //   res.send('你输入了 abcd 或者acd ，也可能是/abcd/balibali 或者 /abd/balabala')
  // })

  // app.use('/ab+cd', function (req, res, next){
  //   res.send('只要您输入以 /abcd /abbcd /abbbbbbcd 开头的请求，就会显示这行文字呦')
  // })
  // 如果输入/abcd 根据中间件函数的顺序的规定 会输出"你输入了 abcd 或者acd ，也可能是/abcd/balibali 或者 /abd/balabala"

  // 其他的路径匹配如下

  // app.use('/ab\*cd', function (req, res, next) {
  //   res.send('匹配以/abcd, /abxcd , /abFOOcd, /abbArcd 等 输入')
  // })

  // app.use('/a(bc)?d', function (req, res, next) {
  //   res.send('匹配以/ad /abcd 为开头的输入')
  // })

  // 正则表达式匹配

  // app.use(/\/abc|\/xyz/, function (req, res, next) {
  //   res.send('匹配以/abc 或 /xyz 开头的路径')
  // })

  // 数组匹配

  // app.use(['/abcd', 'xyza', /\/lmn|\/pqr/], function (req, res, next){
  //   res.send(' 匹配以/abcd /xyza /lmn 或 /pqr 开头的路径')
  // })



  // require 中均为文件路径 即回调函数在signup.js等文件中
  app.use('/signup', require('./signup'))
  app.use('/signin', require('./signin'))
  app.use('/signout', require('./signout'))
  app.use('/posts', require('./posts'))
  app.use('/comments', require('./comments'))

  // 404 page
  app.use(function (req, res) {
    if (!res.headerSent) {
      res.status(404).render('404')
    }
  })
}
