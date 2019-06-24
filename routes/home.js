var express = require('express');
var router = express.Router();
var Inventory = require('../lib/mongo').Inventory;
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var mongo = require('mongodb');
var InventoryModel = require('../models/inventory');
var checkLogin = require('../middlewares/check').checkLogin;
var FavoriteModel = require('../lib/mongo').Favorite;
var BorrowPartModel = require('../models/borrowParts');
var UserModel = require('../models/users');


router.get('/', async (function (req, res, next) {
    var query = {};
    query.admin = '5a246f7a4015d2070b89df75';
    try {
        var userId = new mongo.ObjectId(req.session.user._id);
        // var perPage = 4;
        // var page = req.query.page || 1;
        try {
            var approvalCount = 0;
            var userApprovalCount=0;
            var borrowCount = await (BorrowPartModel.BorrowCountByUser(userId));
            var user = await (UserModel.getUserByDefaultId(userId));
            if (user.isAdmin) {
                console.log("Admin check Passed");
                approvalCount = await (BorrowPartModel.ApprovalPendingCount(user.id));
                userApprovalCount = await (UserModel.countApprovals());
            }
        } catch (error) {
            console.log(error);
            req.flash('error', 'Something went wrong, please try again!');
        }
    } catch (error) {
        req.flash('error', 'Please Signin or Signup to start checking out');
    }
    var curcount;
    var parts = await (Inventory
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
    result = parts;
    res.render('home', {
        parts: result,
        borrowCount: borrowCount,
        approvalCount: approvalCount,
        userApprovalCount: userApprovalCount
    });
}));


router.get('/:partId/favorite', async (function (req, res) {
    var userId = new mongo.ObjectId(req.session.user._id);
    var part_Id = new mongo.ObjectId(req.params.partId);
    var record = await (FavoriteModel.findOne({
        userId: userId,
        partId: part_Id
    }).exec());
    if (record === null) {
        await (FavoriteModel.insertOne({
            userId: userId,
            partId: part_Id,
            favorite: true
        }).exec());
    } else {
        await (FavoriteModel.update({
            userId: userId,
            partId: part_Id,
            favorite: false
        }, {
            $set: {
                favorite: true
            }
        }).exec());
    }
    setTimeout(function () {
        res.redirect('/');
    }, 10);
}));

router.get('/:partId/unfavorite', async (function (req, res) {
    var userId = new mongo.ObjectId(req.session.user._id);
    var part_Id = new mongo.ObjectId(req.params.partId);

    await (FavoriteModel.update({
        userId: userId,
        partId: part_Id,
        favorite: true
    }, {
        $set: {
            favorite: false
        }
    }).exec());

    setTimeout(function () {
        res.redirect('/');
    }, 10);
}));
module.exports = router;