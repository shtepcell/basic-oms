block('form').mod('type', 'user')(
    attrs()(function () {
        return {
            method: 'POST',
            action: this.ctx.action
        };
    })
)
