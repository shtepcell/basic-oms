block('navigator').elem('link').content()(function () {
    var ctx = this.ctx;

    if(!ctx.links) {
        return {
            block: 'link',
            mods: {
                theme: 'islands',
                 size : 'l'
            },
            url: ctx.url,
            content: ctx.text
        }
    } else {
        return {
            block: 'dropdown',
            mods: {
                switcher: 'link',
                theme: 'islands',
                sime: 'l'
            },
            switcher: ctx.text,
            popup: ctx.links
        }
    }

})
