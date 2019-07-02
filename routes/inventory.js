var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var InventoryModel = require('../models/inventory');
var BorrowPartModel = require('../models/borrowParts');
var UserModel = require('../models/users');
var checkLogin = require('../middlewares/check').checkLogin;
var checkIsAdmin = require('../middlewares/check').checkIsAdmin;
var nodeMailer = require('nodemailer');

router.get('/', checkIsAdmin, async (function (req, res, next) {
    var admin = req.query.admin;

    try {
        var parts = await (InventoryModel.getParts(admin));
        var admins = await (UserModel.getAdmins());
        parts.forEach(async (function (part) {
            try {
                var borrowCount = await (BorrowPartModel.getBorrowPartsCount(part._id));
                part.borrowCount = borrowCount;
            } catch (error) {
                req.flash('error', 'Something go wrong, please try again!');
            }
        }), this);

        setTimeout(() => {
            res.render('inventory', {
                parts: parts,
                admins: admins
            });
        }, 1000)
    } catch (error) {
        req.flash('error', 'Something go wrong, please try again!');
        next();
    }

}));

router.post('/', checkIsAdmin, async (function (req, res, next) {
    var admin = req.session.user._id;

    var partData = {
        admin: req.session.user._id,
        name: req.fields.name,
        location: req.fields.location,
        model_no: req.fields.model_no,
        make: req.fields.make,
        inventory: parseInt(req.fields.inventory),
        date: req.fields.date,
        score: parseInt(req.fields.score),
        image: req.fields.image_url || req.files.image.path.split(path.sep).pop(),
        description: req.fields.description
    }
    try {
        if (!partData.name.length) {
            throw new Error('Please fill in the name!');
        }
        if (!partData.description.length) {
            throw new Error('Please fill in the description!');
        }
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var part = {
        admin: partData.admin,
        name: partData.name,
        location: partData.location,
        model_no: partData.model_no,
        make: partData.make,
        inventory: partData.inventory,
        date: partData.date,
        score: partData.score,
        image: partData.image,
        description: partData.description,
        pv: 0,
        show: true
    };

    var checkPart = await (InventoryModel.checkPart(part.name));

    if (!checkPart.length) {
        InventoryModel.create(part)
            .then(function (result) {
                part = result.ops[0];
                req.flash('success', 'Add successfully!');
                res.redirect(`/inventory`);
            })
            .catch(next);
    } else {
        req.flash('error', 'This part has already exist!');
        res.redirect(`/inventory`);
    }

}));

router.get('/:partId', async (function (req, res, next) {
    var partId = req.params.partId;
    try {
        var part = await (InventoryModel.getPartById(partId));
        await (InventoryModel.incPv(partId));
        var manager = await (UserModel.getUserById(part.location));
        var managed_by = manager.name;
        if (!part) {
            throw new Error('The part does not exist!');
        }
        part.location = part.location;
        res.render('part', {
            part: part,
            managed_by: managed_by
        });
    } catch (error) {
        req.flash('error', 'Something go wrong, please try again!');
        next();
    }
}));

router.get('/:partId/remove', checkIsAdmin, function (req, res, next) {
    var partId = req.params.partId;
    var admin = req.session.user._id;

    InventoryModel.delPartById(partId, admin)
        .then(function () {
            req.flash('success', 'Delete the part successfully!');
            res.redirect('/inventory');
        })
        .catch(next);
});

router.post('/:partId/edit', checkIsAdmin, function (req, res, next) {
    var partId = req.params.partId;
    var admin = req.session.user._id;

    var partData = {
        name: req.fields.name,
        model_no: req.fields.model_no,
        make: req.fields.make,
        inventory: parseInt(req.fields.inventory),
        date: req.fields.date,
        score: parseInt(req.fields.score),
        description: req.fields.description
    };

    InventoryModel.updatePartById(partId, admin, partData)
        .then(function () {
            req.flash('success', 'Edit part success!');
            res.redirect('/inventory');
        })
        .catch(next);
});

router.get('/:partId/borrow', checkIsAdmin, async (function (req, res, next) {
    var userId = req.session.user._id;
    var partId = req.params.partId;

    var borrow = {
        userId: userId,
        partId: partId,
        bool: false,
        approval: false
    };
    try {
        var part = await (InventoryModel.getRawPartById(borrow.partId));
        if (part.inventory >= 1) {
            try {
                await (InventoryModel.decInventory(borrow.partId))
                try {
                    await (BorrowPartModel.create(borrow))
                    req.flash('success', 'Borrow Successfully!');
                    res.redirect('back');
                } catch (error) {
                    req.flash('error', 'Something go wrong, please try again!');
                    res.redirect('back');
                }
            } catch (error) {
                req.flash('error', 'Something go wrong, please try again!');
                res.redirect('back');
            }

        } else {
            req.flash('error', 'Zero inventory!');
            res.redirect('back');
        }
    } catch (error) {
        req.flash('error', 'Something go wrong, please try again!');
        res.redirect('back');
    }

}));
router.get('/:partId/borrow/:userId/:day/:manage', checkIsAdmin, async (function (req, res, next) {
    var userId = req.params.userId;
    var partId = req.params.partId;
    var manage = req.params.manage;
    var day = req.params.day;
    var user = await (UserModel.getUserById(userId));
    if (!user) {
        req.flash('error', 'There is no User Id exist, please try another one!');
        res.redirect('back');
        return false;
    }

    var borrow = {
        userId: user._id,
        partId: partId,
        day: parseInt(day),
        bool: false,
        approval: false,
        managed_by: manage
    };
    try {
        var part = await (InventoryModel.getRawPartById(borrow.partId));
        if (part.inventory >= 1) {
            try {
                await (InventoryModel.decInventory(borrow.partId))
                try {
                    await (BorrowPartModel.create(borrow))
                    let transporter = nodeMailer.createTransport({
                        host: '192.168.1.248',
                        port: 465,
                        secure: true,
                        auth: {
                            user: 'netadmin@accord-soft.com',
                            pass: 'accord_123'
                        }
                    });
                    let mailOptions = {
                        from: '"Library System" <library@accord-soft.com> ', // sender address
                        to: user.email, // list of receivers
                        subject: "Book Issued", // Subject line
                        text: "This is an Auto-Generated Mail from Accord CheckOut", // plain text body
                        html: 'Hi,<b>' + user.name + '</b><br><p>Thank you for checking out <b>' + part.name + '</b> for <b>' + day + '</b>days</p>' // html body
                    };
                    console.log("Body Formed , Now Sending");
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message %s sent: %s', info.messageId, info.response);
                        //res.redirect('/home');
                    });
                    console.log("Send Operation Complete");
                    req.flash('success', 'Borrow Successfully by ' + userId + '!');
                    res.redirect('back');
                } catch (error) {
                    console.log(error);
                    req.flash('error', 'Something went wrong, please try again! (Borrow Error)');
                    res.redirect('back');
                }
            } catch (error) {
                console.log(error);
                req.flash('error', 'Something go wrong, please try again!');
                res.redirect('back');
            }

        } else {
            console.log(error);
            req.flash('error', 'Zero inventory!');
            res.redirect('back');
        }
    } catch (error) {
        console.log(error);
        req.flash('error', 'Your part Id maybe wrong, please try again!');
        res.redirect('back');
    }

}));
router.get('/:partId/borrowByUser/:day/:manage', async (function (req, res, next) {
    var userId = req.session.user._id;
    var partId = req.params.partId;
    var day = req.params.day;
    var manage = req.params.manage;
    var user = await (UserModel.getUserByDefaultId(userId));
    var admin = await (UserModel.getUserById(manage));
    var borrow = {
        userId: userId,
        partId: partId,
        day: parseInt(day),
        bool: false,
        approval: false,
        managed_by: manage
    };
    try {
        var part = await (InventoryModel.getRawPartById(borrow.partId));
        if (part.inventory >= 1) {
            try {
                await (InventoryModel.decInventory(borrow.partId))
                try {
                    await (BorrowPartModel.create(borrow))
                    let transporter = nodeMailer.createTransport({
                        host: '192.168.1.248',
                        port: 465,
                        secure: true,
                        auth: {
                            user: 'netadmin@accord-soft.com',
                            pass: 'accord_123'
                        }
                    });
                    let mailOptions = {
                        from: '"Library System" <library@accord-soft.com> ', // sender address
                        to: admin.email, // list of receivers
                        subject: "Book Issued", // Subject line
                        text: "This is an Auto-Generated Mail from Accord CheckOut", // plain text body
                        html: 'Hi, ' + admin.name + '<br><p>' + user.name + ' has borrowed <b>' + part.name + '</b> for <b>' + day + '</b> days</p>' // html body
                    };
                    console.log("Body Formed , Now Sending");
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message %s sent: %s', info.messageId, info.response);
                        //res.redirect('/home');
                    });
                    console.log("Send Operation Complete");
                    req.flash('success', 'Part Borrowed Successfully!');
                    res.redirect('back');
                } catch (error) {
                    console.log(error);
                    req.flash('error', 'Something went wrong, please try again!');
                    res.redirect('back');
                }
            } catch (error) {
                console.log(error);
                req.flash('error', 'Something went wrong, please try again!');
                res.redirect('back');
            }

        } else {
            req.flash('error', 'The Part is Out of Stock !!');
            res.redirect('back');
        }
    } catch (error) {
        console.log(error);
        req.flash('error', 'Something went wrong, please try again!');
        res.redirect('back');
    }

}));



module.exports = router;