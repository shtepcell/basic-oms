block('order').elem('body')(
    tag()('form'),
    attrs()(function () {
        return {
            action: (this.ctx.admin)?`${this.ctx.action}/admin`:this.ctx.action,
            method: 'POST'
        }
    })
)
