// vue.config.js
const path = require('path')
module.exports = {
 
  publicPath: './' // 告诉webpack打包的index.html引入其他资源文件以./开头, 不要默认/开头
}
