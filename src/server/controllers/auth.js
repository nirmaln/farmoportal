'use strict';

var mongoose = require('mongoose'),
    Role = mongoose.model('Role'),
    User = mongoose.model('User'),
    SuperUser = mongoose.model('SuperUser'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    Q = require('q'),
    Logger = require('../utils/logger'),
    systemStatus = require('../utils/systemStatus'),
    fpConfig = require('../appconfig/config.json'),
    constants = require('../utils/constants'),
    encUtil = require('../utils/encutil');

var secret = 'cskTeamEntry@2018';

exports.login = function (req, res) {

    Logger.info('Request for login from ' + req.body.username);

    if (systemStatus.getStatus().MongoDB.status === false) {
        Logger.warn('Could not connect to Mongo DB');
        res.status(401).send('Could not connect to Database !! Please try again later');
    }
    else {
        User.count({}, function (err, count) {
            if (count === 0) {
                findUser(SuperUser, req, res);
            }
            else {
                findUser(User, req, res);
            }
        });
    }
};

function findUser(userModel, req, res) {
    userModel.findOne({name: req.body.username}).exec()
        .then(function (user) {
            if (user === null) {
                throw 'User name does not exist';
            }
            else {
                //Compare passwords
                return Q.all([encUtil.decrypt(user.password, user.key), encUtil.hash(req.body.password, user.seed)])
                    .then(function (values) {
                        if (values[0] !== values[1].hash) {
                            throw 'Invalid password';
                        }
                        else if(passwordExpr(user.passwordChangedDate) === true) {
                            return {passwordExpired: true};
                        }
                        else {
                            return Role.findOne({name: user.rolename}).exec();
                        }
                    })
                    .catch(function (e) {
                        throw(e);
                    });
            }
        })
        .then(function (role) {
            var profile;
            if(role.passwordExpired === true) {
                profile = {
                    username: req.body.username,
                    token: req.body.username + 'securetoken',
                    loginType: 'StandardLogin',
                    permissions: ['Password Expired'],
                    roleName: 'Password Expired'
                };
            }
            else {
                profile = {
                    username: req.body.username,
                    token: req.body.username + 'securetoken',
                    loginType: 'StandardLogin',
                    permissions: role.permissions,
                    roleName: role.name
                };
            }

            var token = jwt.sign(profile, secret, {expiresInMinutes: 60 * 5});

            res.json({token: token});
        })
        .onReject(function (err) {
             res.status(401).send(err);
        });
}


exports.logout = function (req, res) {
    Logger.info('request for logout from user :' + req.body.username);
    res.json({
        message: 'logged out successfully'
    });
};


function passwordExpr(date) {
    var expr = parseInt(fpConfig.passwordExpireDays);
    if(expr !== null || expr !== undefined) {
        if(expr === 0) {
            return false;
        }
        var oldDate = new Date(date);
        var currentDate = new Date();

        return (currentDate - oldDate) > (expr * 24 * 60 * 60 * 1000);
    }
    else {
        return false;
    }
}
