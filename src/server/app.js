'use strict';

var fs = require('fs'),
    _ = require('lodash'),
    express = require('express'),
    fpConfig = require('./appconfig/config.json'),
    versionInfo = require('./utils/versionInfo'),
    constants = require('./utils/constants'),
    Logger = require('./utils/logger'),
    Q = require('q');


Logger.info('******* Starting FP Node server *******');

//check and default the NODE_ENV
if(process.env.NODE_ENV === undefined){
    fpConfig.NODE_ENV = 'development';
    Logger.info('NODE_ENV not set, default to development');
}
else{
    fpConfig.NODE_ENV = process.env.NODE_ENV;
}

Logger.info('process.env.NODE_ENV = ' +  fpConfig.NODE_ENV);
Logger.info('Node Version = ' +  process.versions.node);
Logger.info('__dirname = ' +  __dirname);
Logger.info('process.cwd = ' +  process.cwd());


var versionDetails = versionInfo.getVersionInfo();
Logger.info('FP version : ' + versionDetails.fp);

var mongoose = require('mongoose');

var app = express(),
    port = fpConfig.ui.http_port;

Logger.info('Configuring MongoDB ...');
var db = require('./config/db');
db.init();

require('./models/permission');
require('./models/role');
require('./models/user');
require('./models/superuser');

if (_.contains(['development', 'production'], fpConfig.NODE_ENV)) {
    Logger.info('Adding mock data to Mongo DB');
    require('./config/initdb')();
}

// Delete existing users if 'resetRootUser' flag is set to true
if (_.contains(['development', 'production'], fpConfig.NODE_ENV) && (fpConfig.resetRootUser === true)) {
    Logger.info('Deleted existing users since resetRootUser flag was set to true');
    var User = mongoose.model('User');
    User.remove({}, function(err) {
        if (err) {
            throw 'Could not delete existing users';
        }
    });
}

require('./config/express')(app);

Logger.info('Configuring Express Routes..');
var router = express.Router();
app.use('/bcs/api/', require('./routes/home')(router));

var auth = require('./config/auth');
auth.init(app, router);

app.listen(port, fpConfig.ui.ip);

Logger.info('BCS server listening on ' + fpConfig.ui.ip + ':' + port);


module.exports = app;
