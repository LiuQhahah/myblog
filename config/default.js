//将配置与代码分离，在根目录下，创建配置文件，config-lite为轻量级的读取配置文件模块。
//端口号为3000,mongodb的数据库名称为myblog

module.exports = {
  port: 3000,
  session:{
    secret: 'myblog',
    key: 'myblog',
    maxAge: 2592000000
  },
  mongodb:'mongodb://localhost:27017/myblog'
}
