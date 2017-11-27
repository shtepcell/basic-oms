block('table').elem('row')(
    tag()('tr'),
    js()(function () {
        if(this.ctx.url)
            return {
                url: this.ctx.url
            }
        else return false;
    })
)
