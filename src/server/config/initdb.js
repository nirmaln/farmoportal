'use strict';

var mongoose = require('mongoose'),
    Permission = mongoose.model('Permission'),
    Role = mongoose.model('Role'),
    User = mongoose.model('User'),
    SuperUser = mongoose.model('User'),
    Logger = require('../utils/logger'),
    mockData = require('./mock-data'),
    _ = require('lodash'),
    Q = require('q'),
    constants = require('../utils/constants');

module.exports = function () {

    Permission.remove(function () {
        //Logger.info('Adding Permissions Mock Data...');
        Permission.create(mockData.Permission());
    });

    Role.remove(function () {
       // Logger.info('Adding Roles Mock Data...');
        Role.create(mockData.Role());
    });

    SuperUser.remove(function () {
       // Logger.info('Adding Super User Mock Data...');
        SuperUser.create(mockData.SuperUser());
    });



};

