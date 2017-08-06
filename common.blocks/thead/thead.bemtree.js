block('thead').content()(function() {

    var titles = this.ctx.titles,
        ret = [];
    if( !!titles ) {
        ret = titles.map( item => {
            return {
                tag: 'th',
                content: item
            }
        })
    }

    return {
        tag: 'tr',
        content: ret
    }

});
