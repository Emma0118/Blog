/**
 * Created by majie on 17-6-21.
 */

const mongoose = require('mongoose');

//定义用户表结构
//参考 mongoosejs.com关于  doc的schemas的使用

module.exports = new mongoose.Schema({
    //用户名
    username : String,
    //密码
    password : String,
    isAdmin : {
        type : Boolean,
        default : false
    }
})



