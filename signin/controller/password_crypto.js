const crypto = require('crypto');

module.exports = function (name, pass) {
    return crypto.createHmac('sha1', name).update(pass).digest('hex');
};