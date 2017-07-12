/**
 * Created by majie on 17-6-20.
 */
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', (req, res, next) => { //书写路由时为：localhost:8088/admin/user
    // const user = new User({
    //     username : 'admin',
    //     password : 'admin',
    //     isAdmin : true
    // });
    // user.save();
    res.render('main/index', {//分配模板
        userInfo : req.userInfo
    });
});

module.exports = router;