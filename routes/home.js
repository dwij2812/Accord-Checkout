var express = require('express');
var router = express.Router();
var Inventory = require('../lib/mongo').Inventory;
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var mongo = require('mongodb');
var InventoryModel = require('../models/inventory');
var checkLogin = require('../middlewares/check').checkLogin;
var FavoriteModel = require('../lib/mongo').Favorite;


router.get('/', async (function (req, res, next) {
    var query = {};
    query.admin = '5a246f7a4015d2070b89df75';
    // var perPage = 4;
    // var page = req.query.page || 1;
    var curcount;
    var parts = await (Inventory
        .find({})
        .populate({ path: 'admin', model: 'User' })
        .sort({"inventory" : -1})
        .addCreatedAt()
        .exec());
    var result = [];
        result = parts;
        res.render('home', {
            parts: result
        });
}));


router.get('/:partId/favorite', async (function(req,res){
    var userId = new mongo.ObjectId(req.session.user._id);
    var part_Id = new mongo.ObjectId(req.params.partId);
    var record = await (FavoriteModel.findOne({userId: userId, partId: part_Id}).exec());
    if(record === null) {
        await(FavoriteModel.insertOne({
            userId: userId,
            partId: part_Id,
            favorite: true
        }).exec());
    }
    else {
        await(FavoriteModel.update({userId: userId, partId: part_Id, favorite: false}, {$set:{favorite : true}}).exec());
    }
    setTimeout(function() {
        res.redirect('/');
    }, 10);
}));

router.get('/:partId/unfavorite', async (function(req,res){
    var userId = new mongo.ObjectId(req.session.user._id);
    var part_Id = new mongo.ObjectId(req.params.partId);

    await(FavoriteModel.update({userId: userId, partId: part_Id, favorite: true}, {$set:{favorite : false}}).exec());

    setTimeout(function() {
        res.redirect('/');
    }, 10);
}));
module.exports = router;