block('header').content()(function() {
    var ret = [];
    if(this.data.locals.__user) {
        ret.push({
            block: 'navigator',
        });
    } else {
        ret.push({
            block: 'title',
            mods: {
                type: 'login'
            }
        });
    }
    return ret;
});
