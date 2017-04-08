'use strict';

var systemStatus = require('../utils/systemStatus'),
    u = require('../controllers/user'),
    versionInfo = require('../utils/versionInfo');


module.exports = function (router) {

    /**  Base url for FP REST API server. */
    router.get('/', function (req, res) {
        res.json({
            message: 'FarmOPortal Server REST API'
        });
    });

    /** Get System Status from FP */
    router.get('/systemStatus', function (req, res) {
        var statusObj = systemStatus.getStatus();
        res.json({
            systemStatus: statusObj
        });

    });

    /** Get version info from FP */
    router.get('/versionInfo', function (req, res) {
        res.json({
            versions: versionInfo.getVersionInfo()
        });
    });

    /** Base url for FP REST API server - Version 1 */
    router.get('/v1', function (req, res) {
        res.json({
            message: 'FarmOPoratal Server REST API -- Version 1'
        });
    });

    router.post('/v1/register',u.create);

    return router;
};
