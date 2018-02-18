block('order').elem('stop-info').elemMod('capability', 'no').content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

    return [
        {
            block: 'field',
            elem: 'stop-reason',
            elemMods: {
                access: false
            },
            dataset: dataset,
            order: order,
            display: order.stop.reason
        }
    ]
})

block('order').elem('stop-info').elemMod('capability', 'no').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

    return [
        {
            block: 'field',
            elem: 'stop-reason',
            elemMods: {
                access: true
            },
            dataset: dataset,
            order: order,
            display: true
        }
    ]
})
