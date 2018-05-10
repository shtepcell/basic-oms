block('order').elem('body')(
    tag()('form'),
    attrs()(function () {
        return {
            action: (this.ctx.adminEdit)?`${this.ctx.action}/admin`:this.ctx.action,
            method: 'POST'
        }
    })
)
