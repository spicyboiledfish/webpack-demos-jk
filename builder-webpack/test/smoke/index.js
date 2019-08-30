const path = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');

process.chdir(path.join(__dirname, 'template')); //进入到template目录
rimraf('./dist', () => {

})
