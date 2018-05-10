block('field').elem('city').content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

    if(ctx.display) {
        var value = '';
        if(order.info.city)
            value = `${order.info.city.type} ${order.info.city.name}`

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
                        content: value
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
        var value = `${order.info.city.type} ${order.info.city.name}`;

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
                                val: value,
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
