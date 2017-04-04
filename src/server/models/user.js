'use strict';

var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    Role = mongoose.model('Role');

var UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    seed: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    rolename: {
        type: String,
        required: true
    },
    passwordChangedDate: {
        type: String,
        required: true
    }
});

UserSchema.statics.getUser = function (query, cb) {
    this.findOne(query, function (err, u) {
        if (err || u === null) {
            cb(err);
        }
        else {
            Role.findOne({name: u.rolename}, function (err, r) {
                if (err || r === null)
                    cb(err);
                else {
                    u.permissions = r.permissions;
                    cb(null, u);
                }
            })
        }
    });
};

UserSchema.statics.getUserPromise = function (query) {
    return this.findOne(query).exec().then(function (user) {
        return Role.findOne({name: user.rolename}).exec();
    });
};

mongoose.model('User', UserSchema);
