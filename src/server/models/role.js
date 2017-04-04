'use strict';

var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var RoleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    permissions: [
        String
    ]
});

mongoose.model('Role', RoleSchema);
