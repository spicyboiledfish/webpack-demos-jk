// emit-template-plugin.js
const fs = require('fs')

function EmitTemplate (options) {
  this.templateDir = options.template
  this.targetDir = options.filename
  this.params = options.params
}

EmitTemplate.prototype.apply = function (compiler) {
  var self = this
  compiler.plugin('emit', function (compilation, callback) {
    fs.readFile(self.templateDir, (err, data) => {
      if (err) throw err
      // 匹配参数替换 html 模版中变量
      var reg = new RegExp(`{{\\s*(${Object.keys(self.params).join('|')})\\s*}}`, 'g')
      var html = data.toString().replace(reg, function (str, key, index) {
        return self.params[key]
      })

      fs.writeFile(self.targetDir, html, function () {
        console.log('模版写入成功')
        callback()
      })
    })
  })
}

module.exports = EmitTemplate