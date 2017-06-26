'use strict'

const crypto = require('crypto');
// const secret = require('../conf/secure').secret;
const secret = 'asdasdsdasdsd'

module.exports = {
    createHash: function (pass) {
        return crypto.createHmac('sha256', secret)
            .update(pass)
            .digest('hex');
    }
}
