var Inventory = require('../lib/mongo').Inventory;
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = {
    create: function create(part) {
        return Inventory.create(part).exec();
    },
    getPartById: function (partId) {
        return Inventory
            .findOne({
                _id: partId
            })
            .populate({
                path: 'admin',
                model: 'User'
            })
            .addCreatedAt()
            .exec();
    },
    getParts: function (admin) {
        var query = {};
        if (admin) {
            query.admin = "5a246f7a4015d2070b89df75";
        }
        return Inventory
            .find(query)
            .populate({
                path: 'admin',
                model: 'User'
            })
            .sort({
                "inventory": -1
            })
            .addCreatedAt()
            .exec();
    },
    searchPart: function (data) {
        var queryData = new RegExp(data.trim(), 'i');
        return Inventory
            .find({
                '$or': [{
                    name: queryData
                }, {
                    model_no: queryData
                }, {
                    make: queryData
                }]
            })
            .sort({
                _id: -1
            })
            .exec();
    },
    checkPart: function (partName) {
        return Inventory
            .find({
                name: partName
            })
            .exec();
    },
    getRawPartById: function (partId) {
        return Inventory
            .findOne({
                _id: partId
            })
            .populate({
                path: 'admin',
                model: 'User'
            })
            .exec();
    },
    updatePartById: function (partId, admin, data) {
        return Inventory.update({
            admin: admin,
            _id: partId
        }, {
            $set: data
        }).exec();
    },
    delPartById: function (partId, admin) {
        return Inventory.update({
            admin: admin,
            _id: partId
        }, {
            $set: {
                show: false
            }
        }).exec();
    },
    incPv: function incPv(partId) {
        return Inventory
            .update({
                _id: partId
            }, {
                $inc: {
                    pv: 1
                }
            })
            .exec();
    },
    incInventory: function incInventory(partId) {
        return Inventory
            .update({
                _id: partId
            }, {
                $inc: {
                    inventory: 1
                }
            })
            .exec();
    },
    decInventory: function decInventory(partId) {
        return Inventory
            .update({
                _id: partId
            }, {
                $inc: {
                    inventory: -1
                }
            })
            .exec();
    },
    getAllParts: function () {
        var query = {};
        query.admin = "5a246f7a4015d2070b89df75";
        return Inventory
            .find(query)
            .populate({
                path: 'admin',
                model: 'User'
            })
            .sort({
                "inventory": -1
            })
            .addCreatedAt()
            .exec();
    }
};