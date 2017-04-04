'use strict';

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
            name: 'root',
            permissions: ['User Administration']
        },
        {
            name: 'admin',
            permissions: [
                'Permission1',
                'Permission2',
                'Permission3',
                'Permission4'
            ]
        },
        {
            name: 'Role1',
            permissions: [
                'Permission1',
                'Permission2',
                'Permission3',

            ]
        },
        {
            name: 'Role2',
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
