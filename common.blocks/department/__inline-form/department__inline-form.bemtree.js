block('department').elem('inline-form').content()(function () {
    var ctx = this.ctx;
    
    var ret = ctx.content.map( item => {
        return {
            block: 'department',
            elem: 'inline-form-cell',
            content: item
        }
    })
    return ret;
})
