'use strict';
var mongoose = require('mongoose'),
    Role = mongoose.model('Role'),
    _ = require('lodash');

exports.role = function (req, res, next, id) {
    Role.findOne({'_id': id}, function (err, role) {
        req.role = role;
        next();
    })
};


exports.create = function (req, res) {
    var role = new Role(req.body);

    role.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot save the role'
            });
        }
        res.json(role);
    });
};

exports.update = function (req, res) {
    var role = req.role;

    role = _.extend(role, req.body);

    role.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot update the role'
            });
        }
        res.json(role);
    });
};


exports.destroy = function (req, res) {
    var role = req.role;
    role.remove(function (err) {
        if (err) {
            return res.status(500).json({error: 'Cannot delete the role'});
        }
        res.json(role);
    });
};

exports.all = function (req, res) {
    Role.
    find().
    select('-_id -__v').
    exec(function (err, roles) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot list the role'
            });
        }
        res.json(roles);
    });
};
