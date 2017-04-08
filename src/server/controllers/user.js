'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    _ = require('lodash'),
    constants = require('../utils/constants'),
    encUtil = require('../utils/encutil'),
    Logger = require('../utils/logger'),
    Q = require('q');

exports.create = function (req, res) {
    var user = new User(req.body);

    encUtil.hash(req.body.password)
        .then(function(ret) {
            var hash = ret.hash;
            user.seed = ret.seed;

            encUtil.encrypt(hash).then(function (ret) {
                user.password = ret.value;
                user.key = ret.key;
                user.passwordChangedDate = new Date();

                user.save(function (err) {
                    if (err) {
                        Logger.warn('Failed to add new user' + JSON.stringify(err));
                        res.status(500).json({
                            error: 'Cannot save the user'
                        });
                    }
                    else {
                        Logger.info('Successfully added new user : ' + JSON.stringify(user));
                        res.json({name: user.name, rolename: user.rolename});
                    }
                });
            });
        });
};


function saveUser(savedByUser, user, res, userDiff) {
    return user.save(function (err) {
        if (err) {
            res.status(500).json({
                error: 'Cannot update the user'
            });
        }
        else {
            res.json({name: user.name, rolename: user.rolename});
        }
    });
}


function updateUser(user, updatedByUser, res) {
    User.findOne({'name': user.name}, function (errFind, retUser) {
        if (errFind) {
            return res.status(404).json({
                error: 'Cannot find the user'
            });
        }
        User.find({rolename: 'admin'}, function (err, adminUsers) {
            // Check to ensure last admin role is not changed
            if (!err && adminUsers.length === 1 && (adminUsers[0].name === user.name && user.rolename !== 'admin')) {
                var lastAdminError = 'Last admin, cannot change users role!';
                return res.status(500).json({
                    error: lastAdminError
                });
            }

            Q.all([encUtil.decrypt(retUser.password, retUser.key), encUtil.hash(user.oldPassword, retUser.seed)])
                .then(function (values) {
                    if (values[0] !== values[1].hash) {
                        throw 'Invalid password';
                    }
                    else {
                        retUser.name = user.name;
                        retUser.rolename = user.rolename === undefined ? retUser.rolename : user.rolename;

                        if (user.password !== "") {
                            retUser.passwordChangedDate = new Date();
                            encUtil.hash(user.password).then(function (ret) {
                                var hash = ret.hash;
                                retUser.seed = ret.seed;

                                encUtil.encrypt(hash).then(function (ret) {
                                    retUser.password = ret.value;
                                    retUser.key = ret.key;
                                    saveUser(updatedByUser, retUser, res, userDiff);
                                });
                            });
                        }
                        else {
                            saveUser(updatedByUser, retUser, res, userDiff);
                        }
                    }
                })
                .catch(function (e) {
                    res.status(500).json({
                        error: e
                    });
                });
        });
    });
}



exports.update = function (req, res) {
    var user = req.body;
    var userName;
    if (req.hasOwnProperty('user')) {
        userName = req.user.username;
    }

    updateUser(user, userName, res);
};


function canDestroy(users) {
    return (users && users.length > 0 && _.some(users, {'rolename': 'admin'}));
}


exports.destroy = function (req, res) {
    var users = req.params.users.trim().split(",");
    var userName;
    if (req.hasOwnProperty('user')) {
        userName = req.user.username;
    }

    User.
    find({name: {$nin: users}}).
    select('-_id -__v -key -seed -password').
    exec(function (err, retUsers) {
        if (err || !canDestroy(retUsers)) {
            return res.status(500).json({error: 'Attempted to remove all users with admin role'});
        }
        else {
            User.remove({name: {$in: users}}, function(err) {
                if (err) {
                    return res.status(500).json({error: 'Cannot delete the users'});
                }
                res.json(users);
            });
        }
    });
};

exports.all = function (req, res) {
    User.
    find().
    select('-_id -__v -key -seed -password').
    exec(function (err, users) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot list the users'
            });
        }
        res.json(users);
    });
};
