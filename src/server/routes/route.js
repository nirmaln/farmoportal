'use strict';

var _ = require('lodash'),

    p = require('../controllers/permission'),
    r = require('../controllers/role'),
    u = require('../controllers/user'),
    a = require('../controllers/auth');

module.exports = function(router) {

    router.route('/permission')
        .get(p.all);

    router.route('/role/')
        .get(r.all);

    router.param('role_id', r.role);

    router.route('/role/:role_id')
        .post(r.create)
        .put(r.update)
        .delete(r.destroy);

    router.route('/user/')
        //.post(u.create)
        //.get(u.all)
        .put(u.update);

    //router.route('/user/:users')
    //    .post(u.destroy);

    router.route('/login')
        .post(a.login);

    router.route('/logout')
        .post(a.logout);


    return router;
};
