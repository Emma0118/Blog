/**
 * Created by majie on 17-7-13.
 */
const mongoose = require('mongoose');

//定义博客分类表结构
//参考 mongoosejs.com关于  doc的schemas的使用

module.exports = new mongoose.Schema({
    //分类名称
    name : String
})