block('user')(
    tag()('form'),
    attrs()(function () {
        return {
            action: this.ctx.url,
            method: 'POST'
        }
    })
)
