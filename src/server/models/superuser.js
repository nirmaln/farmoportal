
'use strict';

var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var SuperUserSchema = new Schema({
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
    }
});

mongoose.model('SuperUser', SuperUserSchema);
