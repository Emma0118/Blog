/**
 * Created by linajiema on 2017/7/13.
 */
 //创建 博客 分类表结构
const  mongoose = require('mongoose');
const categoriesSchema = require('../schemas/categories');
// mongoose.Promise = global.Promise;
// var db = mongoose.connect('mongodb://localhost:27018/');
module.exports = mongoose.model('Category', categoriesSchema); //其实是一个  构造函数