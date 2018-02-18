block('field').elem('provider').content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

    if(ctx.display)
    return [
        {
            block: 'order',
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Провайдер'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: `[${order.stop.provider.type}] ${order.stop.provider.name}`
                }
            ]
        }
    ];
})

block('field').elem('provider').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

    if(!order.stop.provider)
        order.stop.provider = {};
    
    if(ctx.display) {
        return [
            {
                block: 'order',
                elem: 'body-row',
                content: [
                    {
                        block: 'order',
                        elem: 'body-row-name',
                        content: 'Провайдер *'
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
                                val: (order)?order.stop.provider.name:'',
                                placeholder: 'Миранда-медиа',
                                name: 'provider',
                                dataprovider: {
                                    data: dataset['providers']
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
})
