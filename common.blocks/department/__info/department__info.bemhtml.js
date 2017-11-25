block('department').elem('info')(
    attrs()(function () {
        return {
            action: this.ctx.url,
            method: 'POST'
        }
    }),
    tag()('form')
)
