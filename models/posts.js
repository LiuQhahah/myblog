const Post = require('../lib/mongo').Post
const CommentModel = require('./comments')
const marked = require('marked')

// 将post 地content 从markdown 转换成html
Post.plugin('contentToHtml', {
  afterFind: function(posts) {
    return posts.map(function (post) {
      post.content = marked(post.content)
      return post
    })
  },

  afterFindOne: function (post) {
    if(post) {
      post.content = marked(post.content)
    }
    return post
  }
})



// 给post 添加留言数commentsCount
Post.plugin('addCommentsCount', {
  afterFind: function (posts) {
    return Promise.all(posts.map(function (post) {
      return CommentModel.getCommentsCount(post._id).then(function (commentsCount){
        post.commentsCount = commentsCount
        return post
      })
    }))
  },

  afterFindOne: function (post) {
    if(post) {
      return CommentModel.getCommentsCount(post._id).then(function (count) {
        post.commentsCount = count
        return post
      })
    }
    return post
  }
})

module.exports = {
  //创建一篇文章 post为参数,posts.js中/ceate方法调用PostModel.create(post)

  create: function create (post) {
    return Post.create(post).exec()
  },

  //通过文章id 获取一篇文章
  getPostById: function getPostById (postId) {
    return Post
      .findOne({ _id: postId })
      .populate({ path: 'author', model: 'User'})
      .addCreatedAt()
      .addCommentsCount()
      .contentToHtml()
      .exec()
  },

  // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
  // author 为参数，调用时应getPosts('liua')
  getPosts: function getPosts (author) {
    const query = {}
    if(author) {
      query.author = author
    }


    // 将author在转化成query.author,在Post中返回数据
    return Post
      .find(query)
      .populate({ path: 'author', model: 'User'})
      .sort({_id: -1})
      .addCreatedAt()
      .addCommentsCount()
      .contentToHtml()
      .exec()
  },

  // 通过文章 id给pv 加1
  incPv: function incPv (postId) {
    return Post
      .update( { _id: postId }, { $inc: { pv: 1}})
      .exec()
  },

  // 通过文章id 获取一篇原生文章
  getRawPostById: function getRawPostById (postId) {
    return Post
      .findOne({ _id: postId})
      .populate({path: 'author', model: 'User'})
      .exec()
  },

  //通过文章id 更新一篇文章
  updatePostById: function updatePostById (postId, data) {
    return Post.update({ _id: postId}, { $set: data}).exec()
  },

  // 通过文章id 删除一篇文章
  delPostById: function delPostById(postId, author) {
    return Post.deleteOne({ author: author, _id: postId})
    .exec()
    .then(function (res) {
      //文章删除后，再删除该文章下的所有留言
      if(res.result.ok && res.result.n >0) {
        return CommentModel.delCommentsByPostId(postId)
      }
    })
  }
}
