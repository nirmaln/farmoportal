
'use strict';


(function(auth){

    var Logger = require('../utils/logger');
    var expressJwt  = require('express-jwt');
    require('jsonwebtoken');

    var app;
    var router;
    var apiPath = "/fp/api";
    var secret = 'cskTeamEntry@2018'; //TODO : Remove hardcoded secure string

    auth.init = init;

    function init(_app_, _router_){
        Logger.info('Configuring Auth module..');
        app = _app_;
        router=_router_;
        app.use(apiPath, expressJwt({secret: secret}));
        configureRoutes();
        handleUnauth();
    }

    function configureRoutes(){
        Logger.info('Configuring Secure Routes..');
        app.use(apiPath + '/v1', require('../routes/route')(router));
    }

    function handleUnauth() {

        app.use(function (err, req, res) {
            if (err.constructor.name === 'UnauthorizedError') {
                res.status(401).send('Unauthorized');
            }
        });
    }

})(module.exports);
