'use strict';

var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var PermissionSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

mongoose.model('Permission', PermissionSchema);
