const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
mongolass.connect(config.mongodb)


const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')

// 根据 id 生成创建时间 created_at


mongolass.plugin('addCreatedAt', {
  afterFind: function (results) {
    results.forEach(function (item) {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
    })
    return results
  },
  afterFineOne: function (result) {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id).format('YYYY-MM-DD HH:mm'))
    }
    return result
  }
})


mongolass.connect(config.mongolass)



// 用户，包含用户名，密码，头像，性别，简介；
// 文章包含：作者，标题，内容，浏览数
// 评论包含作者，内容以及文章的id

// 我们定义了用户表的 schema，生成并导出了 User 这个 model，同时设置了 name 的唯一索引，保证用户名是不重复的
// 三选一的性别
exports.User = mongolass.model('User', {
  name: { type: 'string', required: true},
  password: {type: 'string', required: true},
  avatar: { type: 'string', required: true},
  gender: {type: 'string', enum: ['m','f','x'], default: 'x'},
  bio: {type: 'string', required: true}
})

exports.User.index({ name: 1}, { unique: true }).exec() //根据用户名找到用户，用户名全局唯一

// 存储作者的id,标题，正文，点击量

exports.Post = mongolass.model('Post', {
  author: {type : Mongolass.Types.ObjectId, required: true},
  title: {type: 'string', required: true},
  content: {type: 'string', required: true},
  pv: {type: 'number', default: 0}
})


// 利用1与-1 来表示升序与降序
exports.Post.index({ author: 1, _id: -1 }).exec() //按创建时间降序查询用户的文章列表


exports.Comment = mongolass.model('Comment', {
  author: {type: Mongolass.Types.ObjectId, required: true},
  content: { type: 'string', required: true},
  postId: {type: Mongolass.Types.ObjectId, required: true}
})

exports.Comment.index({ postId: 1, _id: 1}).exec() // 通过文章id 获取该文章下所有留言，按留言创建时间升序
