block('form')(
    tag()('form'),
    attrs()(function () {
        return {
            method: 'POST',
            action: this.ctx.action
        };
    })
)
