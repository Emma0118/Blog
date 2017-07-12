/**
 * Created by majie on 17-6-20.
 */
const express = require('express');
const router = express.Router();
const User = require('../models/User'); //操作数据库

//统一返回格式
let responseData;
// console.log(router.use);
router.use((req, res, next) => {
    // debugger;
    responseData = {
        code : 0,
        message : '',
        userInfo : {},
    }
    //console.log(req);
    next();
});


/**
 * 用户注册
 *  注册逻辑
 *
 *  1.用户名不能为空
 *  2.密码不能为空
 *  3.两次输入密码必须一直
 *
 *  1.用户是否已经被注册了
 *      数据库查询
 * */

router.post('/user/register', function (req, res, next) { //定义路由，并执行相应路由下的操作
    //console.log(req.body);//body-parser的作用
    // let username = req.body.username;
    // let password = req.body.password;
    // let repassword = req.body.repassword;
    const {username, password, repassword} = req.body;
    if(username === '') {
        responseData.code = 1;
        responseData.message = '用户名不能为空！';
        res.json(responseData); //res中的方法，将 对象转化成json格式返回给前端～ dataType : json
        return;
    }
    if(password === '') {
        responseData.code = 2;
        responseData.message = '密码不能为空！';
        res.json(responseData); //res中的方法，将 对象转化成json格式返回给前端～ dataType : json
        return;
    }
    if(password !== repassword) {
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致！';
        res.json(responseData); //res中的方法，将 对象转化成json格式返回给前端～ dataType : json
        return;
    }
    //通过使用数据库 数据库 model 构造函数中的 findone方法 查找 用户名是否相同
    User.findOne({ //返回一个 Promise对象 可以使用 then
        username : username
    }).then((userInfo) => {
        if(userInfo)  {
            responseData.code = 4;
            responseData.message = '用户名已被注册了';
            res.json(responseData);
            return;
        }
        //保存用户注册的信息到数据库中
        //不需要直接操作数据库，通过操作 User 来实现
        const user = new User({
            username : username,
            password : password
        });
        return user.save();
    }).then((newUserInfo) => { //获取用户注册信息之后的信息
        responseData.message = '注册成功';
        res.json(responseData);
    });
})

router.post('/user/login', (req, res, next) => {
    const {username, password} = req.body;
    if((username == '') || (password == '')) {
        responseData.code = 1;
        responseData.message = '用户名或密码不能为空';
        res.json(responseData);
        return;
    }
    //查询数据库中相同用户名和密码的记录是否存在，如果存在则登录成功
    User.findOne({
        username : username,
        password : password
    })
    .then(userInfo => {
        console.log(userInfo);
        if(!userInfo) {
            responseData.code = 2;
            responseData.message = '用户名或密码输入错误！';
            console.log(responseData);
            res.json(responseData);
            return;
        }
        responseData.message = '登录成功！';

        responseData.userInfo = {
            _id : userInfo.id,
            _username : username
        }
        req.cookies.set('userInfo', JSON.stringify(  //服务器发送cookie信息给浏览器（名字就是 userInfo），浏览器会保存起来，以后每次访问本站，浏览器都会把这些信息以报头的方式发送给服务端，服务端据此判断是否是登录状态
            {
                _id : userInfo.id,
                _username : username
            }
        ));
        res.json(responseData);
        return;
    })

    //用户名和密码是正确的

})

router.get('/user/logout', (req, res, next) => {
    req.cookies.set('userInfo', null);
    res.json(responseData);
})

module.exports = router;