const common = require('./common');

module.exports = {
    info: function (text, user) {
        var moment = new Date();
        if(user) user=`<${user.login}>`;
        else user = '';
        console.log(`[INFO] ${common.dateToExtStr(moment)} ${user} ${text}`);
    },
    warn: function (text) {
        var moment = new Date();
        console.warn(`[WARN] ${common.dateToExtStr(moment)} ${text}`);
    },
    error: function (text) {
        var moment = new Date();
        console.error(`[ERROR] ${common.dateToExtStr(moment)} ${text}`);
    }
}
