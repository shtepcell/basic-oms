block('field').elem('client').content()(function () {
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
                        content: 'Клиент'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: `[${order.info.client.type.shortName}] ${order.info.client.name}`
                    }
                ]
            }
        ]
    }
})

block('field').elem('client').elemMod('access', true).content()(function () {
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
                        content: 'Клиент *'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block : 'suggest',
                                mods : {
                                    theme : 'islands',
                                    size : 'l',
                                    'has-dataprovider' : 'adress'
                                },
                                val: (order)?order.info.client.name:'',
                                placeholder: 'ООО "Газпром"',
                                name: 'client',
                                dataprovider: {
                                    data: dataset['clients']
                                }
                            }
                        ]
                    }
                ]
            },
        ]
    }
})
