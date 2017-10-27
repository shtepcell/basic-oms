block('short-search').elem('form').attrs()(function () {
        return {
        method: 'POST',
        action: this.ctx.action
    }}
)
block('short-search').elem('form').tag()('form')
