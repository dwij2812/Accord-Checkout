var express = require('express');
var router = express.Router();
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var UserModel = require('../models/users');
var InventoryModel = require('../models/inventory');
var BorrowPartModel = require('../models/borrowParts');

var checkIsAdmin = require('../middlewares/check').checkIsAdmin;

router.get('/', checkIsAdmin, async (function (req, res, next) {
    var admin = req.query.admin;

    res.render('quick_borrow');
          
}));

module.exports = router;