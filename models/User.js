/**
 * Created by majie on 17-6-21.
 */


//创建user模型类

const  mongoose = require('mongoose');
const userSchema = require('../schemas/user');
// mongoose.Promise = global.Promise;
// var db = mongoose.connect('mongodb://localhost:27018/');
module.exports = mongoose.model('User', userSchema); //其实是一个  构造函数