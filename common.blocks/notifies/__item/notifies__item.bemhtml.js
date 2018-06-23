block('notifies').elem('item')(
    tag()('a'),
    attrs()(function () {
        return {
            href: `/order/${this.ctx.order}`
        }
    })
)
