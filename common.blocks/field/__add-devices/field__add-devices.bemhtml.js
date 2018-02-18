block('field').elem('add-devices').content()(function () {
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
                        content: 'Дополнительное оборудование'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: order.stop.add_devices
                    }
                ]
            }
        ]
    }
})

block('field').elem('add-devices').elemMod('access', true).content()(function () {
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
                        content: 'Дополнительное оборудование'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'input',
                                name: 'add_devices',
                                mods: {
                                    width: 'available',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                val: order.stop.add_devices,
                                autocomplete: false,
                                placeholder: 'Дополнительное оборудование'
                            }
                        ]
                    }
                ]
            },
        ]
    }
})
