block('order').elem('adress-info').elemMod('type', 'location').content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    if(!order)
        order = {
            info: {}
        }

    return [
        {
            block: 'field',
            elem: 'street',
            order: order,
            elemMods: {
                access: false
            },
            display: true
        },
        {
            block: 'field',
            elem: 'adds',
            order: order,
            elemMods: {
                access: false
            },
            display: true
        }
    ]
})


block('order').elem('adress-info').elemMod('type', 'location').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

    return [
        {
            block: 'field',
            elem: 'street',
            order: order,
            elemMods: {
                access: true
            },
            dataset: dataset,
            display: true
        },
        {
            block: 'field',
            elem: 'adds',
            order: order,
            elemMods: {
                access: true
            },
            dataset: dataset,
            display: true
        }
    ]
})
