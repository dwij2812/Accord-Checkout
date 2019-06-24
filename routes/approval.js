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
        var users = await (BorrowPartModel.getAllBorrowParts(req.session.user.id));
        users.forEach(async (function(user){
            var userInfo = await (UserModel.getUserByDefaultId(user.userId));
            var partInfo = await (InventoryModel.getPartById(user.partId));
            result.push({
                userId: user.userId,
                name: userInfo.name,
                id: userInfo.id,
                avatar: userInfo.avatar,
                borrowTime: user.created_at,
                borrowId: user._id,
                partId: user.partId,
                returnTime: user.return_time,
                bool: user.bool,
                approval: user.approval,
                partname: partInfo.name,
                partmodel_no: partInfo.model_no,
                partpic: partInfo.image
            })
        }));

        setTimeout(function() {
            res.render('approval', {
                borrowUser: result
            });
        }, 1000);  

    } catch (error) {
        next();
    }
      
}));

module.exports = router;