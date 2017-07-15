/**
 * Created by majie on 17-7-13.
 */

//创建 分类表 模型
const  mongoose = require('mongoose');
const categoriesSchema = require('../schemas/categories');
// mongoose.Promise = global.Promise;
// var db = mongoose.connect('mongodb://localhost:27018/');
module.exports = mongoose.model('Category', categoriesSchema); //其实是一个  构造函数