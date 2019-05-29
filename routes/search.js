var express = require('express');
var router = express.Router();

var InventoryModel = require('../models/inventory');
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/:payload', function (req, res, next) {
    var payload = req.params.payload,
        type = req.query.type;

    InventoryModel.searchPart(payload)
        .then(function (parts) {
            switch (type) {
                case 'inventory':
                    res.render('inventory', {
                        parts: parts
                    });
                    break;
                default:
                    res.render('home', {
                        parts: parts
                    });
            }  
        })
        .catch(next);
});

module.exports = router;