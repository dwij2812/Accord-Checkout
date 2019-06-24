var User = require('../lib/mongo').User;

module.exports = {
    create: function (user) {
        return User.create(user).exec();
    },
    getUserById: function (id) {
        return User
            .findOne({
                id: id
            })
            .addCreatedAt()
            .exec();
    },
    getUserByDefaultId: function (id) {
        return User
            .findOne({
                _id: id
            })
            .addCreatedAt()
            .exec();
    },
    getAdmins: function () {
        return User
            .find({
                isAdmin: true
            })
            .addCreatedAt()
            .exec();
    },
    approveUser: function (userid) {
        return User.update({ id: userid, isActive: false}, { $set: { isActive: true}}).exec();
    },
    countApprovals: function () {
        return User
                    .count({isActive: false})
                    .exec();
    },
    getAllPendingUsers: function(){
        return User
            .find({ isActive:false})
            .sort({ _id: -1 })
            .addCreatedAt()
            .exec();
    }
};