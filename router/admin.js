/**
 * Created by majie on 17-6-20.
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Category = require('../models/Category');



router.use((req,res, next) => {
    if(!req.userInfo.isAdmin) { //如果不是管理员
        res.send('对不起，只有管理员才可以进入该页面');
        return;
    }
    next(); //next我的理解是，跳出 本函数执行下一个方法 -》
})

//后台 首页

router.get('/', (req, res, next) => { //书写路由时为：localhost:8088/admin 相当于路由的拼接   /admin/
    res.render('admin/index', { //这里设置参数 渲染这个页面时 使用参数
        userInfo : req.userInfo
    });

});


/**
 * 用户管理页面
 * */

router.get('/user', (req, res, next) => { //书写路由时为：localhost:8088/admin 相当于路由的拼接   /admin/user

    /**
     * 从数据库中读取所有用户数据
     *
     * limit(Number)  : 限制获取的数据条数
     *
     * skip(2)  忽略数据的条数，从第三条开始取
     *
     * 每页显示 2 条
     * 1 ： 1-2 skip:0 == (当前页 -1) × limit
     * 2: 3-4 skip:2
     * */
    let page = Number(req.query.page || 1); //当前页
    const limit = 2;
    const skip = (page - 1) * limit;
    User.count().then(count => {

        //计算总页数
        const pages = Math.ceil(count / limit);

        //限定page的取值

        page = Math.min(page, pages);
        page = Math.max(page, 1);

        User.find() // 数据库查询
            .limit(limit) //限制 显示 2条
            .skip(skip)
            .then((users) => {
                res.render('admin/user_index', { //这里设置参数 渲染这个页面时 使用参数
                    userInfo : req.userInfo,
                    users : users,
                    count : count,
                    pages : pages,
                    page : page,
                    limit : limit
                });
            })
    })


})

/**
 * 分类首页
 * */

router.get('/category', (req, res, next) => {
    let page = Number(req.query.page || 1); //当前页
    const limit = 2;
    const skip = (page - 1) * limit;
    User.count().then(count => {

        //计算总页数
        const pages = Math.ceil(count / limit);

        //限定page的取值

        page = Math.min(page, pages);
        page = Math.max(page, 1);

        Category.find() // 数据库查询
            .limit(limit) //限制 显示 2条
            .skip(skip)
            .then((categories) => {
                res.render('admin/category_index', { //这里设置参数 渲染这个页面时 使用参数
                    userInfo : req.userInfo,
                    categories : categories,
                    count : count,
                    pages : pages,
                    page : page,
                    limit : limit
                });
            })
    })
})
/**
 * 分类添加
 * */

router.get('/category/add', (req, res, next) => {
    res.render('admin/category_add', {
        userInfo : req.userInfo
    })
})
/**
 * 分类的保存
 * */

router.post('/category/add', (req, res, next) => {
    console.log(req.body); //bodyParser 使用 req.body处理用户提交的数据
    const name = req.body.name;
    if(name === '') {
        res.render('admin/error', {
            userInfo : req.userInfo,
            message : '名称不能为空'
        })
        return;
    }
    //查询数据库中是否已有该分类
    Category.findOne({
        name : name
    }).then(rs => {
        if(rs) {
            res.render('admin/error', {
                userInfo : req.userInfo,
                message : '分类已经存在'
            })
            return Promise.reject();

        }else {
            //数据库中不存在该分类，进行保存
            return new Category({
                name : name
            }).save()

        }
    }).then(newCategory => {
        res.render('admin/success', {
            userInfo : req.userInfo,
            message : '分类保存成功',
            url : '/admin/category'
        })
    }).catch(err => {
        return err
    })

})

/**
 * 分类修改
 * */

/**
 * 分类删除
 * */

module.exports = router;
