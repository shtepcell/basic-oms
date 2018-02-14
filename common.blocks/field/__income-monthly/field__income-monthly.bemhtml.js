block('field').elem('income-monthly').content()(function () {
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
                        content: 'Ожидаемый ежемес. доход (руб)'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: `${order.info['income-monthly']}`
                    }
                ]
            }
        ]
    }
})

block('field').elem('income-monthly').elemMod('access', true).content()(function () {
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
                        content: 'Ожидаемый ежемес. доход (руб) *'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'input',
                                name: 'income-monthly',
                                mods: {
                                    width: 'available',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                val: order.info['income-monthly'],
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
