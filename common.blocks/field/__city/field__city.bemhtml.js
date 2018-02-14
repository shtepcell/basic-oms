block('field').elem('city').content()(function () {
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
                        content: 'Город'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: `${order.info.city.type} ${order.info.city.name}`
                    }
                ]
            }
        ]
    }
})

block('field').elem('city').elemMod('access', true).content()(function () {
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
                        content: 'Город *'
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
                                val: `${order.info.city.type} ${order.info.city.name}`,
                                placeholder: 'г. Москва',
                                name: 'city',
                                dataprovider: {
                                    data: dataset['cities']
                                }
                            }
                        ]
                    }
                ]
            },
        ]
    }
})
