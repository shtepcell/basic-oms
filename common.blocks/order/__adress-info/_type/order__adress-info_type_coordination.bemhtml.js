block('order').elem('adress-info').elemMod('type', 'coordination').content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    if(!order)
        order = {
            info: {}
        }

    return [
        {
            block: 'field',
            elem: 'coordinate',
            order: order,
            elemMods: {
                access: false
            },
            display: true
        }
    ]
})


block('order').elem('adress-info').elemMod('type', 'coordination').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

    return [
        {
            block: 'field',
            elem: 'coordinate',
            order: order,
            elemMods: {
                access: true
            },
            display: true
        }
    ]
})
