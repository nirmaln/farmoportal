'use strict';

(function (handler) {

    function replacer(str){
        return String.fromCharCode(parseInt(str.substr(2), 16));
    }

    function toHexReplacer(str) {
        return '\\x' + (str.toString(16)).slice(-2);
    }

})(module.exports);
