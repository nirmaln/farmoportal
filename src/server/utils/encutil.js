
'use strict';

(function (handler) {

    var crypto = require('crypto'),
        q = require('q');

    var hashAlgorithm = 'sha256';

    var encoding = 'utf8',
        encodingType = 'hex',
        seedLength = 8;

    var algorithm = 'aes-256-cfb';

    handler.init = init;
    handler.hash = hash;
    handler.encrypt = encrypt;
    handler.decrypt = decrypt;

    function init() {
    }

    function random(howMany, chars) {
        chars = chars || "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
        var rnd = crypto.randomBytes(howMany)
            , value = []
            , len = chars.length;

        for (var i = 0; i < howMany; i++) {
            value.push(chars[rnd[i] % len]);
        }
        return value.join('');
    }

    function randomValueHex(len) {
        return crypto.randomBytes(Math.ceil(len / 2))
            .toString('hex')
            .slice(0, len);
    }


    function hash(message, seed) {
        return q.Promise(function (resolve, reject) {
            if (message === null || message === undefined) {
                reject('checksum : input message is invalid');
            }
            else {
                if (seed === null || seed === undefined) {
                    //generate new seed
                    seed = random(seedLength);
                }
                var hashValue = crypto
                    .createHmac(hashAlgorithm, seed)
                    .update(message, encoding)
                    .digest(encodingType);
                resolve({seed: seed, hash: hashValue});
            }
        });
    }


    function encrypt(text) {
        return q.Promise(function (resolve, reject) {
            if (text === null || text === undefined) {
                reject('encrypt : input message is invalid');
            }
            else {
                //create the key first
                var key = randomValueHex(seedLength);
                var cipher = crypto.createCipher(algorithm, key);
                var encrypted = cipher.update(text, encoding, encodingType);
                encrypted += cipher.final(encodingType);
                resolve({value: encrypted, key: key});
            }
        });
    }


    function decrypt(encrypted, key) {
        return q.Promise(function (resolve, reject) {
            if (encrypted === null || encrypted === undefined) {
                reject('decrypt : input encrytped message is invalid');
            }
            else if (key === null || key === undefined) {
                reject('decrypt : input key is invalid');
            }
            else {

                var decipher = crypto.createDecipher(algorithm, key);
                var dec = decipher.update(encrypted, encodingType, encoding);
                dec += decipher.final(encoding);
                resolve(dec);
            }
        });
    }

})(module.exports);
