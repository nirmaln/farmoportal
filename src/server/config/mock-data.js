'use strict';
var constants = require('../utils/constants');

module.exports.Permission = function () {
    return [
        {name: 'Permission1'},
        {name: 'Permission2'},
        {name: 'Permission3'},
        {name: 'Permission4'}
    ];
};

module.exports.Role = function () {
    return [
        {
            name: constants.FP_Roles.ROOT,
            permissions: ['User Administration']
        },
        {
            name: constants.FP_Roles.ADMIN,
            permissions: [
                'Permission1',
                'Permission2',
                'Permission3',
                'Permission4'
            ]
        },
        {
            name: constants.FP_Roles.SUPPLIER,
            permissions: [
                'Permission1',
                'Permission2',
                'Permission3',

            ]
        },
        {
            name: constants.FP_Roles.PRODUCER,
            permissions: [
                'Permission1',
                'Permission2'
            ]
        },
        {
            name: constants.FP_Roles.ALL,
            permissions: [
                'Permission1',
                'Permission2'
            ]
        }
    ];
};

module.exports.SuperUser = function () {
    return {
        name: 'fpadmin',
        password: '',
        seed: '',
        key: '',
        rolename: 'root'
    };
};
