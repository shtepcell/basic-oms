const helper = require('./helper');

module.exports = {
    info: function (text, user) {
        var moment = new Date();
        if(user) user=`<${user.login}>`;
        else user = '';
        console.log(`[INFO] ${helper.dateToExtStr(moment)} ${user} ${text}`);
    },
    warn: function (text) {
        var moment = new Date();
        console.warn(`[WARN] ${helper.dateToExtStr(moment)} ${text}`);
    },
    error: function (text) {
        var moment = new Date();
        console.error(`[ERROR] ${helper.dateToExtStr(moment)} ${text}`);
    }
}
