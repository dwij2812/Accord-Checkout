var express = require('express');
var router = express.Router();
var await = require('asyncawait/await');
var async = require('asyncawait/async');
var Inventory = require('../lib/mongo').Inventory;
var mongo = require('mongodb');
var UserModel = require('../models/users');
var InventoryModel = require('../models/inventory');
var checkLogin = require('../middlewares/check').checkLogin;
var FavoriteModel = require('../lib/mongo').Favorite;
var BorrowPartModel = require('../models/borrowParts');

router.get('/:payload', async(function (req, res, next) {
    var payload = req.params.payload,
        type = req.query.type;
        var query = {};
        query.admin = '5a246f7a4015d2070b89df75';
        try {
            var userId = new mongo.ObjectId(req.session.user._id);
            // var perPage = 4;
            // var page = req.query.page || 1;
            try {
                var approvalCount = 0;
                var userApprovalCount=0;
                var TotalBorrowCount= await(BorrowPartModel.getTotalBorrowed());
                var borrowCount = await (BorrowPartModel.BorrowCountByUser(userId));
                var user = await (UserModel.getUserByDefaultId(userId));
                if (user.isAdmin) {
                    console.log("Admin check Passed");
                    approvalCount = await (BorrowPartModel.ApprovalPendingCount(user.id));
                    userApprovalCount = await (UserModel.countApprovals());
                }
                var partsall = await (Inventory
                    .find({})
                    .populate({
                        path: 'admin',
                        model: 'User'
                    })
                    .sort({
                        "inventory": -1
                    })
                    .addCreatedAt()
                    .exec());
                var result = [];
                result = partsall;
            } catch (error) {
                console.log(error);
                req.flash('error', 'Something went wrong, please try again!');
            }
        } catch (error) {
            console.log(error);
            req.flash('error', 'Please Signin or Signup to start checking out');
        }
    InventoryModel.searchPart(payload)
        .then(function (parts) {
            switch (type) {
                case 'inventory':
                    res.render('home', {
                        parts: parts,
                        partsall: partsall,
                        borrowCount: borrowCount,
                        approvalCount: approvalCount,
                        userApprovalCount: userApprovalCount,
                        TotalBorrowCount: TotalBorrowCount
                    });
                    break;
                default:
                    res.render('home', {
                        parts: parts,
                        partsall: partsall,
                        borrowCount: borrowCount,
                        approvalCount: approvalCount,
                        userApprovalCount: userApprovalCount,
                        TotalBorrowCount: TotalBorrowCount
                    });
            }  
        })
        .catch(next);
}));

module.exports = router;