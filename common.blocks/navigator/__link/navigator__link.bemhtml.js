block('navigator').elem('link').content()(function () {
    var ctx = this.ctx;

    return {
        block: 'link',
        mods: {
            theme: 'islands',
             size : 'l'
        },
        url: ctx.url,
        content: ctx.text
    }
})
