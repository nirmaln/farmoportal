'use strict';

var Logger = require('./logger'),
    fpConfig = require('../appconfig/config.json');


module.exports = {

    fp: {
        version: ''
    },

    getVersionInfo: function () {

        try {
            if (this.fp.version === '') {
                //development path
                var pkgJsonPath = '../../../package.json';
                if (fpConfig.NODE_ENV === 'production') {
                    //production path
                    pkgJsonPath = '../package.json';
                }
                var pkgJson = require(pkgJsonPath);
                this.fp.version = pkgJson.version;
            }
        }
        catch(err){
            Logger.warn('Error in getVersionInfo '+ err);
            Logger.warn('Error Stack Trace : ' + err.stack);
        }
        return {fp: this.fp.version}


    }
};
