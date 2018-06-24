block('field').elem('sks-time').content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    if(!order.sks) order.sks = {};

    if(ctx.display) {
        return [
            {
                block: 'order',
                elem: 'body-row',
                content: [
                    {
                        block: 'order',
                        elem: 'body-row-name',
                        content: 'Срок реализаци'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: order.sks.time
                    }
                ]
            }
        ]
    }
})

block('field').elem('sks-time').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

    if(!order.sks) order.sks = {};

    if(ctx.display) {
        return [
            {
                block: 'order',
                elem: 'body-row',
                content: [
                    {
                        block: 'order',
                        elem: 'body-row-name',
                        content: 'Срок реализации *'
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
                                val: order.sks.time,
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
