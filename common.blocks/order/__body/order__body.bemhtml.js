block('order').elem('body')(
    tag()('form'),
    attrs()(function () {
        return {
            action: this.ctx.action,
            method: 'POST'
        }
    })
)
