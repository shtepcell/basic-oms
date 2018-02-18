block('field').elem('stop-cost-monthly').content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

    if(ctx.display) {
        return [
            {
                block: 'order',
                elem: 'body-row',
                content: [
                    {
                        block: 'order',
                        elem: 'body-row-name',
                        content: 'Операционные затраты ежемесячные'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: order.stop['cost-monthly']
                    }
                ]
            }
        ]
    }
})

block('field').elem('stop-cost-monthly').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

    if(ctx.display) {
        return [
            {
                block: 'order',
                elem: 'body-row',
                content: [
                    {
                        block: 'order',
                        elem: 'body-row-name',
                        content: 'Операционные затраты ежемесячные *'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'input',
                                name: 'cost-monthly',
                                mods: {
                                    width: 'available',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                val: order.stop['cost-monthly'],
                                autocomplete: false,
                                placeholder: '3000'
                            }
                        ]
                    }
                ]
            },
        ]
    }
})
