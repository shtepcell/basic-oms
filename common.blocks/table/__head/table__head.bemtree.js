block('table').elem('head').content()(function () {
    var ctx = this.ctx,
        ret = [];

    ctx.columns.forEach( item => {
        ret.push({
            elem: 'cell',
            content: item
        })
    })

    return {
        elem: 'row',
        content: ret
    }
})
