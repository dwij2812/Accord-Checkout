var BorrowParts = require('../lib/mongo').BorrowPart;
var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');
module.exports = {
    create: function(borrowpart) {
        return BorrowParts.create(borrowpart).exec();
    },
    getBorrowParts: function(userId) {
        return BorrowParts
                    .find({ userId: userId })
                    .populate({ path: 'admin', model: 'User' })
                    .sort({ bool: 1 })
                    .addCreatedAt()
                    .exec();
    },
    getBorrowPartsCount: function(partId) {
        return BorrowParts
                    .count({ partId: partId, bool: false})
                    .exec();
    },
    returnPartById: function (id) {
        return BorrowParts.remove({ _id: id }).exec();
    },
    getBorrowUsers: function(partId) {
        return BorrowParts
                    .find({ partId: partId})
                    .sort({ _id: 1 })
                    .addCreatedAt()
                    .exec();
    },
    returnPartByPartId: function(partId, userId) {
        return BorrowParts.update({ partId: partId, userId: userId, bool: false, approval: true, return_time: null}, { $set: { bool: true,approval: false, return_time: moment().format('YYYY-MM-DD HH:mm')}}).exec();
    },
    returnPartByPartIdUser: function(partId, userId) {
        return BorrowParts.update({ partId: partId, userId: userId, bool: false, return_time: null, approval: false}, { $set: { approval: true}}).exec();
    },
    getAllBorrowParts: function(managedby){
        return BorrowParts
            .find({ approval:true,managed_by:managedby })
            .sort({ _id: -1 })
            .addCreatedAt()
            .exec();
    },
    BorrowCountByUser: function(userId) {
        return BorrowParts
                    .count({ userId: userId, bool: false})
                    .exec();
    },
    ApprovalPendingCount: function(userId) {
        return BorrowParts
                    .count({ managed_by: userId, bool:false, approval:true})
                    .exec();
    },
    getTotalBorrowed: function() {
        return BorrowParts
                    .count({bool: false})
                    .exec();
    }
}