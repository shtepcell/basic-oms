block('field').elem('sks-cost-once').content()(function () {
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
                        content: 'Одноразовая стоимость организации'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: `${order.sks['cost-once']}`
                    }
                ]
            }
        ]
    }
})

block('field').elem('sks-cost-once').elemMod('access', true).content()(function () {
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
                        content: 'Одноразовая стоимость организации *'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'input',
                                name: 'cost-once',
                                mods: {
                                    width: 'available',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                val: order.sks['cost-once'],
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
