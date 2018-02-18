block('field').elem('stop-org-info').content()(function () {
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
                        content: 'Информация об организации'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: order.stop.organization_info
                    }
                ]
            }
        ]
    }
})

block('field').elem('stop-org-info').elemMod('access', true).content()(function () {
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
                        content: 'Информация об организации'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'input',
                                name: 'organization_info',
                                mods: {
                                    width: 'available',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                val: order.stop.organization_info,
                                autocomplete: false,
                                placeholder: 'Информация об организации'
                            }
                        ]
                    }
                ]
            },
        ]
    }
})
