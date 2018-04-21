block('settings').elem('body').attrs()(function () {
    return {
        method: 'POST',
        action: this.ctx.action
    }
})
block('settings').elem('body').tag()('form')
