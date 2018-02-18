block('field').elem('time').content()(function () {
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
                        content: 'Срок организации'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: order.stop.time
                    }
                ]
            }
        ]
    }
})

block('field').elem('time').elemMod('access', true).content()(function () {
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
                        content: 'Срок организации *'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'input',
                                name: 'time',
                                mods: {
                                    width: 'available',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                val: order.stop.time,
                                autocomplete: false,
                                placeholder: '30'
                            }
                        ]
                    }
                ]
            },
        ]
    }
})
