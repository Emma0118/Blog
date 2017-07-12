/**
 * 应用程序的启动（入口）文件
 * */

//加载express模块
const express  =require('express');
//加载模板处理模块
const swig = require('swig');
//加载数据库模块
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // 或者 = require('bluebird'); 是为了处理 mongodb 自带 promise出错的问题
//加载body-parser 用来处理post提交过来的数据

const bodyParser = require('body-parser'); //参考 使用文档 用来处理post提交过来的数据

//加载cookies，使浏览器可以记录当前的登录状态
const Cookies = require('cookies');
//操作数据库

const User = require('./models/User');


//创建app应用 =>相当于 NodeJs Http.createServer对象
const app = express();
/*使用app.use设置中间件，使用每次访问本网站，网站都加载这些设置*/


/**
 * 设置静态文件托管
 * 当用户访问的url以/public开始，那么直接返回对应的__dirname + '/public'下的文件
 * */
app.use('/public', express.static(__dirname + '/public')); //字符串 的 拼接 简单！！

/**
 * 配置及注册模板
 *
 * */

/**
 * 配置模板 选择使用express.engine
 * 定义当前应用所使用豆模板引擎
 * @param 模板引擎的名称 也是模板文件的后缀！！
 * @param 解析处理模板内容的方法
 * */
app.engine('html', swig.renderFile);


/**
 * 设置模板文件的存放目录
 * @param 必须是 'views' 这是规定
 * @param 存放目录
 * */
app.set('views', './views');

/**
 * 注册所使用的模板
 * @param 第一个参数必须是 'view engine'
 * @param 第二个参数和 app.engine中定义的模板引擎的名称一致
 * */
app.set('view engine', 'html');

//模板默认使用缓存，在开发过程中，需要取消模板缓存
swig.setDefaults({cache : false});

//body-parser 设置
app.use(bodyParser.urlencoded({extended : true}));

//cookies设置
app.use((req, res, next) => {
    req.cookies = new Cookies(req, res, next);

    //解析登录用户的 cookie信息
    req.userInfo = {};
    if(req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo')) //转化为 js对象
            //获取当前登录用户的类型 是否是 管理员 通过数据库查询 findById

            User.findById(req.userInfo._id).then((userInfo) => {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })

        }catch(err){}
    }else {
        next();
    }

    //console.log(req.cookies.get('userInfo')); // typeof is  json string

})





//
// /**
//  * 首页
//  * req request 对象
//  * res response 对象
//  * next 函数  当前路由匹配 要执行的函数
//  * */
// app.get('/', (req, res, next) => {
//     //res.send('<h1>欢迎光临我的博客</h1>') // 这里就需要将html文件单独出来，实现前后端的分离 因此 加载模板！！
//
//     /**
//      * 读取指定views目录下的指定文件，解析并返回给客户端
//      * @param 第一个参数 表示模板的文件 相对于views目录  views/index.html
//      * @param 第二个参数 表示传递给模板使用的数据
//      * */
//     res.render('index');
// });

/**
 * 根据不同的功能划分模块
 * */
app.use('/admin', require('./router/admin')); //后台管理页面的实现
app.use('/api', require('./router/api')); //前台展示页面的实现
app.use('/', require('./router/main'));




//连接数据库
mongoose.connect('mongodb://localhost:27018/blog', (err) => { //blog就是指定的数据库
    if(err) {
        console.log(err);
        console.log('数据库连接失败');
    }else {
        console.log('数据库连接成功！');
        //监听http请求
        app.listen(8088);
    }
});



