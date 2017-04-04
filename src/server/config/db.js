'use strict';

(function (handler) {

    var mongoose = require('mongoose'),
        fpConfig = require('../appconfig/config.json'),
        systemStatus = require('../utils/systemStatus'),
        constants = require('../utils/constants'),
        fs = require('fs'),
        path = require('path'),
        Logger = require('../utils/logger');

    var isMongoConnected = true;

    handler.init = init;

    function init() {

        try {

            var connectionString = getConnectionString();

            Logger.info('MongoDB connection string : ' + connectionString);
            var connect = function () {
                var options = {
                    server: {
                        socketOptions: {
                            keepAlive: 15
                        }
                    }
                };
                mongoose.connect(connectionString, options);
            };
            connect();

            mongoose.connection.on('error', function (err) {
                systemStatus.updateStatus(constants.FPNodes.MONGO_DB, false);

                if(isMongoConnected) {
                    Logger.warn('Mongoose connection error: ' + err);
                }
                isMongoConnected = false;
            });

            mongoose.connection.on('open', function () {
                systemStatus.updateStatus(constants.FPNodes.MONGO_DB, true);
                Logger.info('Mongoose connection opened');
            });

            mongoose.connection.on('disconnected', function () {
                systemStatus.updateStatus(constants.FPNodes.MONGO_DB, false);
                if(isMongoConnected) {
                    Logger.warn('Mongoose connection disconnected');
                }

                isMongoConnected = false
                connect();
            });
            mongoose.connection.on('connected', function () {
                systemStatus.updateStatus(constants.FPNodes.MONGO_DB, true);
                Logger.info('Mongoose connection Connected');
                isMongoConnected = true;
            });

            mongoose.connection.on('reconnected', function () {
                systemStatus.updateStatus(constants.FPNodes.MONGO_DB, true);
                Logger.info('Mongoose connection reconnected');
                isMongoConnected = true;
            });

            process.on('SIGINT', function () {
                mongoose.connection.close(function () {
                    Logger.info('Mongoose connection disconnected through app termination');
                    process.exit(0);
                });
            });

            systemStatus.updateConfig(constants.FPNodes.MONGO_DB,{db_name: fpConfig.mongo.db_name, db_url: fpConfig.mongo.ip});
        }
        catch(err){
            Logger.info('Exception db.init' + err);
            Logger.warn('Error Stack Trace : ' + err.stack);
        }

    }

    /**
     * get Mongo DB connection string
     * @returns {string}
     */
    function getConnectionString(){
        var connectionString ='mongodb://';

        if(fpConfig.NODE_ENV === 'production') {
            if (fpConfig.mongo.username && fpConfig.mongo.password) {
                connectionString += fpConfig.mongo.username + ':' + fpConfig.mongo.password + '@';
            }
            else {
                Logger.info('No username and password found for Mongo DB');
            }
        }

        if(fpConfig.mongo.ip && fpConfig.mongo.port){
            connectionString += fpConfig.mongo.ip + ':' + fpConfig.mongo.port+'/';
        }
        else{
            Logger.warn('No IP and Port found for Mongo DB');
        }

        if(fpConfig.mongo.db_name ){
            connectionString += fpConfig.mongo.db_name;
        }
        else{
            Logger.warn('No DB name found for Mongo DB');
        }

        return connectionString;

    }
})(module.exports);
