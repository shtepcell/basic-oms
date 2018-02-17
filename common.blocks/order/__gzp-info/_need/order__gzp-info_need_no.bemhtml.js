block('order').elem('gzp-info').elemMod('need', 'no').content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    if(!order) {
        order = {
            gzp: {
                capability: false
            }
        }
    }
    if(ctx.display)
    return [
        {
            block: 'order',
            elem: 'capability',
            order: order,
            elemMods: {
                type: 'yes'
            }
        }
    ]
})

block('order').elem('gzp-info').elemMod('need', 'no').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order;


    if(!order) {
        order = {
            gzp: {
                capability: false
            }
        }
    }
    
    if(ctx.display)
    return [
        {
            block: 'order',
            elem: 'capability',
            order: order,
            elemMods: {
                access: true,
                type: 'yes'
            }
        }
    ]
})
