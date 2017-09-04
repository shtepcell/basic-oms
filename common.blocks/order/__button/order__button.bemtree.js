block('order').elem('button').content()(function () {
    return {
        block: 'button',
        mods: {
            theme: 'islands',
            size: 'm'
        },
        action: this.ctx.action,
        text: this.ctx.text
    }
})
