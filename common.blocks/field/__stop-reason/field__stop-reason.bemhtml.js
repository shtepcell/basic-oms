block('field').elem('stop-reason').content()(function () {
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
                        content: 'Причина технической невозможности'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: order.stop.reason
                    }
                ]
            }
        ]
    }
})

block('field').elem('stop-reason').elemMod('access', true).content()(function () {
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
                        content: 'Причина технической невозможности *'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'input',
                                name: 'reason',
                                mods: {
                                    width: 'available',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                val: order.stop.reason,
                                autocomplete: false,
                                placeholder: 'Причина'
                            }
                        ]
                    }
                ]
            },
        ]
    }
})
