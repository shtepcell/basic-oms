block('field').elem('income-once').content()(function () {
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
                        content: 'Ожидаемый единовр. доход (руб)'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: `${order.info['income-once']}`
                    }
                ]
            }
        ]
    }
})

block('field').elem('income-once').elemMod('access', true).content()(function () {
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
                        content: 'Ожидаемый единовр. доход (руб) *'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'input',
                                name: 'income-once',
                                mods: {
                                    width: 'available',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                val: order.info['income-once'],
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
