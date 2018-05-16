block('order').elem('stop-info').elemMod('capability', 'yes').content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

    return [
        {
            block: 'field',
            elem: 'provider',
            elemMods: {
                access: false
            },
            dataset: dataset,
            order: order,
            display: true
        },
        {
            block: 'field',
            elem: 'provider-contact',
            elemMods: {
                access: false
            },
            dataset: dataset,
            order: order,
            display: order.stop.contact
        },
        // {
        //     block: 'field',
        //     elem: 'devices',
        //     elemMods: {
        //         access: false
        //     },
        //     dataset: dataset,
        //     order: order,
        //     display: order.stop.devices
        // },
        // {
        //     block: 'field',
        //     elem: 'add-devices',
        //     elemMods: {
        //         access: false
        //     },
        //     dataset: dataset,
        //     order: order,
        //     display: order.stop.add_devices
        // },
        // {
        //     block: 'field',
        //     elem: 'interfaces',
        //     elemMods: {
        //         access: false
        //     },
        //     dataset: dataset,
        //     order: order,
        //     display: order.stop.interfaces
        // },
        {
            block: 'field',
            elem: 'time',
            elemMods: {
                access: false
            },
            dataset: dataset,
            order: order,
            display: true
        },
        { block: 'order', elem: 'separator' },
        // {
        //     block: 'field',
        //     elem: 'stop-add-info',
        //     elemMods: {
        //         access: false
        //     },
        //     dataset: dataset,
        //     order: order,
        //     display: order.stop.add_info
        // },
        {
            block: 'field',
            elem: 'stop-org-info',
            elemMods: {
                access: false
            },
            dataset: dataset,
            order: order,
            display: order.stop.organization_info
        },
        {
            block: 'field',
            elem: 'stop-cost-once',
            elemMods: {
                access: false
            },
            dataset: dataset,
            order: order,
            display: true
        },
        {
            block: 'field',
            elem: 'stop-cost-monthly',
            elemMods: {
                access: false
            },
            dataset: dataset,
            order: order,
            display: true
        }
    ]
})

block('order').elem('stop-info').elemMod('capability', 'yes').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

        return [
            {
                block: 'field',
                elem: 'provider',
                elemMods: {
                    access: true
                },
                dataset: dataset,
                order: order,
                display: true
            },
            {
                block: 'field',
                elem: 'provider-contact',
                elemMods: {
                    access: true
                },
                dataset: dataset,
                order: order,
                display: true
            },
            // {
            //     block: 'field',
            //     elem: 'devices',
            //     elemMods: {
            //         access: true
            //     },
            //     dataset: dataset,
            //     order: order,
            //     display: true
            // },
            // {
            //     block: 'field',
            //     elem: 'add-devices',
            //     elemMods: {
            //         access: true
            //     },
            //     dataset: dataset,
            //     order: order,
            //     display: true
            // },
            // {
            //     block: 'field',
            //     elem: 'interfaces',
            //     elemMods: {
            //         access: true
            //     },
            //     dataset: dataset,
            //     order: order,
            //     display: true
            // },
            {
                block: 'field',
                elem: 'time',
                elemMods: {
                    access: true
                },
                dataset: dataset,
                order: order,
                display: true
            },
            { block: 'order', elem: 'separator' },
            // {
            //     block: 'field',
            //     elem: 'stop-add-info',
            //     elemMods: {
            //         access: true
            //     },
            //     dataset: dataset,
            //     order: order,
            //     display: true
            // },
            {
                block: 'field',
                elem: 'stop-org-info',
                elemMods: {
                    access: true
                },
                dataset: dataset,
                order: order,
                display: true
            },
            {
                block: 'field',
                elem: 'stop-cost-once',
                elemMods: {
                    access: true
                },
                dataset: dataset,
                order: order,
                display: true
            },
            {
                block: 'field',
                elem: 'stop-cost-monthly',
                elemMods: {
                    access: true
                },
                dataset: dataset,
                order: order,
                display: true
            }
        ]
})
