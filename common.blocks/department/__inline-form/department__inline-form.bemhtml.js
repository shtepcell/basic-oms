block('department').elem('inline-form')(
    attrs()(function () {
        return {
            action: this.ctx.url,
            method: 'POST'
        }
    }),
    tag()('form')
)
