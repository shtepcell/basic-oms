block('field').elem('street').content()(function () {
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
                        content: 'Улица'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: `${order.info.street.type} ${order.info.street.name}`
                    }
                ]
            }
        ]
    }
})

block('field').elem('street').elemMod('access', true).content()(function () {
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
                        content: 'Улица *'
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
                                val: `${order.info.street.type} ${order.info.street.name}`,
                                placeholder: 'ул. Привокзальная',
                                name: 'street',
                                dataprovider: {
                                    data: dataset['streets']
                                }
                            }
                        ]
                    }
                ]
            },
        ]
    }
})
