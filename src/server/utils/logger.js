
var winston = require('winston');
var path = require('path');
var moment = require('moment');
var fs = require('fs');
var fpConfig = require('../appconfig/config.json');
winston.emitErrs = true;

function myTimestamp() {
    return moment().format();
}

function getLoggerTransports() {

    if (!fs.existsSync(fpConfig.logDirectory)) {
        fs.mkdirSync(fpConfig.logDirectory);
    }

    var fpDirectory = fpConfig.logDirectory + '/' + 'fp';

    if (!fs.existsSync(fpDirectory)) {
        fs.mkdirSync(fpDirectory);
    }

    var loggerTransports = [];

    //Add Text file logger
    // 5MB
    var fileLogger = new winston.transports.File({
        level: 'info',
        filename: fpDirectory + '/' + 'FP.log',
        handleExceptions: true,
        humanReadableUnhandledException: true,
        json: false,
        maxsize: 5242880,
        maxFiles: 100,
        colorize: false,
        timestamp: myTimestamp
    });

    loggerTransports.push(fileLogger);

    if (process.env.NODE_ENV !== 'production') {
        var debugLogger = new winston.transports.Console({
            timestamp: myTimestamp,
            level: 'debug',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false,
            colorize: true
        });
        loggerTransports.push(debugLogger);
    }
    return loggerTransports;
}

var logger = new winston.Logger({
    transports: getLoggerTransports(),
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function (message) {
        logger.info(message);
    }
};

