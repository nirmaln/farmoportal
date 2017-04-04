'use strict';

var mongoose = require('mongoose'),
    Permission = mongoose.model('Permission');

exports.all = function(req, res) {
    Permission.find().exec(function (err, permissions) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot list the permission'
            });
        }
        res.json(permissions);
    });
};
