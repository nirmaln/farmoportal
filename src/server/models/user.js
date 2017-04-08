'use strict';

var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    Role = mongoose.model('Role');


var UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    country : {
        type: String,
        default : "India"
    },
    birthDate : {
        type: String,
        required: true
    },
    gender : {
        type : String
    },
    password: {
        type: String,
        required: true
    },
    seed: {
        type: String
    },
    key: {
        type: String
    },
    rolename: {
        type: String,
        default : "All"
    },
    emailId : {
        type: String,
        required: true
    },
    passwordChangedDate: {
        type: String,
        required: true
    }
});


mongoose.model('User', UserSchema);
