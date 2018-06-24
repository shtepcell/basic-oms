block('field').elem('sks-cost-monthly').content()(function () {
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
                        content: `${order.sks['cost-monthly']}`
                    }
                ]
            }
        ]
    }
})

block('field').elem('sks-cost-monthly').elemMod('access', true).content()(function () {
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
                                val: order.sks['cost-monthly'],
                                autocomplete: false,
                                placeholder: '12500'
                            }
                        ]
                    }
                ]
            },
        ]
    }
})
