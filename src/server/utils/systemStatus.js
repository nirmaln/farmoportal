'use strict';

var Logger = require('./logger');
var constants = require('./constants');

module.exports = {
    MongoDB: {
        status: false,
        config: ''
    },

    updateStatus: function (key, status) {

        if ((key === constants.FPNodes.MONGO_DB)) {
            this.MongoDB.status = status;
        }
    },

    updateConfig: function (key, config) {
        if ((key === constants.FPNodes.MONGO_DB)) {
            this.MongoDB.config = config;
        }
    },

    getStatus: function () {
        return ({MongoDB: this.MongoDB});
    }


};
