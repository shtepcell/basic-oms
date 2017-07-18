block('header').content()(function() {
    var ret = [];
    if(this.data.locals.__user) {
        ret.push({
            block: 'navigator',
        });
    }
    return ret;
});
