var express = require('express');
var router = express.Router();
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var UserModel = require('../models/users');
var BorrowPartModel = require('../models/borrowParts');
var BorrowParts = require('../lib/mongo').BorrowPart;
var checkIsAdmin = require('../middlewares/check').checkIsAdmin;
var InventoryModel = require('../models/inventory');

router.get('/', checkIsAdmin, async (function (req, res, next) {
    var result = [];
    try {
        var users = await (UserModel.getAllPendingUsers());
        users.forEach(async (function(user){
            var userInfo = await (UserModel.getUserById(user.id));
            result.push({
                id: userInfo.id,
                name: userInfo.name,
                avatar: userInfo.avatar,
                gender: userInfo.gender,
                bio: userInfo.bio,
                isActive: userInfo.isActive
            })
        }));

        setTimeout(function() {
            res.render('userApproval', {
                newUser: result
            });
        }, 1000);  

    } catch (error) {
        next();
    }
      
}));

module.exports = router;