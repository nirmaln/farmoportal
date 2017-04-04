'use strict';

/**
 * Expose configurations in development
 * @module config/express
 */


var fs = require('fs'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    path = require('path'),
    Logger = require('../utils/logger'),
    fpConfig = require('../appconfig/config.json');

module.exports = function (app) {

    if (fpConfig.NODE_ENV === 'production') {
        app.use('/fp', express.static(path.resolve('./', '../client')));
    }
    else {
        app.use('/bower_components', express.static(path.resolve(__dirname, '../../../bower_components')));
        app.use('/fp/', express.static(path.resolve(__dirname, '../../client')));
    }

    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
};
