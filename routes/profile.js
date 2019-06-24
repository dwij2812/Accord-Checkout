var express = require('express');
var router = express.Router();
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var UserModel = require('../models/users');
var InventoryModel = require('../models/inventory');
var BorrowPartModel = require('../models/borrowParts');
var checkLogin = require('../middlewares/check').checkLogin;
var checkIsAdmin = require('../middlewares/check').checkIsAdmin;

router.get('/:userId', checkLogin, async (function (req, res, next) {
    var currentUser = req.session.user;
    var userId = req.params.userId;
    var user = await (UserModel.getUserByDefaultId(userId));
    
    try {
        var bPart = await (BorrowPartModel.getBorrowParts(user._id))

        var result = [];
        bPart.forEach(async (function(item) {
            var part = await (InventoryModel.getRawPartById(item.partId));

            var temp = item.created_at.split(" ");
            var returnTime = temp[0].split("-");
            var someDate = new Date(temp[0]);
            someDate.setDate(someDate.getDate() + parseInt(item.day)); //number  of days to add, e.x. 15 days
            var rTime = someDate.toISOString().substr(0,10);

            var returnDate = item.return_time;


            result.push({
                id: item._id,
                userId: userId,
                partId: item.partId,
                created_at: item.created_at,
                returnTime: rTime,
                name: part.name,
                model_no: part.model_no,
                image: part.image,
                description: part.description,
                bool: item.bool,
                returnDate: returnDate,
                approval: item.approval
            })
        }));
        setTimeout(() => {
            res.render('profile', {
                profile: user,
                borrow: result
            })  
        }, 1000)
    } catch(e) {
        req.flash('error', 'Something go wrong, please try again!');
    }
}));

router.get('/:partId/return2/:userId', checkIsAdmin, async (function (req, res, next) {
    var partId = req.params.partId,
        userId = req.params.userId;
    
    var user = await (UserModel.getUserById(userId));
   
    try {
        await (BorrowPartModel.returnPartByPartId(partId, user._id)); // partid, user._id
        var part = await (InventoryModel.getRawPartById(partId));
        try {
            await (InventoryModel.incInventory(partId))
            req.flash('success', 'Return Successfully!');
            res.redirect('back');
        } catch (e) {
            req.flash('error', 'Something go wrong, please try again!');
            res.redirect('back');
        } 
    } catch (error) {
        req.flash('error', 'Can\'t find the borrowed record, please try again!');
        res.redirect('back');
    }
}));

router.get('/:partId/returnu/:userId', async (function (req, res, next) {
    var partId = req.params.partId,
        userId = req.params.userId;
    
    var user = await (UserModel.getUserById(userId));
   
    try {
        try {
            await (BorrowPartModel.returnPartByPartIdUser(partId, user._id)); // partid, user._id
            req.flash('success', 'Return Request created Successfully!');
            res.redirect('back');
        } catch (e) {
            req.flash('error', 'Something went wrong, please try again!');
            res.redirect('back');
        } 
    } catch (error) {
        req.flash('error', 'Can\'t find the borrowed record, please try again!');
        res.redirect('back');
    }
}));

router.get('/approve/:userId', async (function (req, res, next) {
    console.log("Approve Fnction Called By the User");
    var userId = req.params.userId;
    try {
        try {
            await (UserModel.approveUser(userId));
            req.flash('success', 'User Approved !');
            res.redirect('back');
        } catch (e) {
            console.log(e);
            req.flash('error', 'Something went wrong, please try again!');
            res.redirect('back');
        } 
    } catch (error) {
        req.flash('error', 'Can\'t find the user record, please try again!');
        res.redirect('back');
    }
}));

module.exports = router;