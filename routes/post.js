var express = require('express');
var router = express.Router();

var BorrowPartModel = require('../models/borrowParts');

var checkLogin = require('../middlewares/check').checkLogin;

router.get('/:userId', function(req, res) {
    
})