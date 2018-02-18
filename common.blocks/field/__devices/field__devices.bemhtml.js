block('field').elem('devices').content()(function () {
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
                        content: 'Оборудование'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: order.stop.devices
                    }
                ]
            }
        ]
    }
})

block('field').elem('devices').elemMod('access', true).content()(function () {
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
                        content: 'Оборудование *'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'input',
                                name: 'devices',
                                mods: {
                                    width: 'available',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                val: order.stop.devices,
                                autocomplete: false,
                                placeholder: 'Оборудование'
                            }
                        ]
                    }
                ]
            },
        ]
    }
})
