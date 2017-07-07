block('popup').mod('type', 'notify')(
    js()(true),
    content()(function () {
        return {
            block: 'popup',
            elem: 'text',
            content: this.ctx.text
        }
    }),
    mix()(function () {
        return {
            block: 'popup',
            elem: this.ctx.type
        }
    })
)
