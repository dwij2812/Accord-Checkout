var express = require('express');
var router = express.Router();
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var UserModel = require('../models/users');
var BorrowPartModel = require('../models/borrowParts');
var BorrowParts = require('../lib/mongo').BorrowPart;
var checkIsAdmin = require('../middlewares/check').checkIsAdmin;

router.get('/:partId', checkIsAdmin, async (function (req, res, next) {
    var partId = req.params.partId;
    var result = [];
    try {
        var users = await (BorrowPartModel.getBorrowUsers(partId));
        users.forEach(async (function(user){
            var userInfo = await (UserModel.getUserByDefaultId(user.userId))
            result.push({
                userId: user.userId,
                name: userInfo.name,
                id: userInfo.id,
                avatar: userInfo.avatar,
                borrowTime: user.created_at,
                borrowId: user._id,
                partId: partId,
                returnTime: user.return_time,
                bool: user.bool,
                approval: user.approval
            })
        }));

        setTimeout(function() {
            res.render('borrow', {
                borrowUser: result
            });
        }, 1000);  

    } catch (error) {
        next();
    }
      
}));

module.exports = router;