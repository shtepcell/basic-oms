block('field').elem('clientType').content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    if(ctx.display) {
        return [
            {
                block: 'order',
                elem: 'body-row',
                content: [
                    {
                        block: 'order',
                        elem: 'body-row-name',
                        content: 'Тип клиента'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: order.info.clientType || 'Не указан'
                    }
                ]
            }
        ]
    }
})

block('field').elem('clientType').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

    const types = dataset.types.map( item => {
        return {
            text: item,
            val: item
        }
    });

    if (order && !order.info.clientType) {
        types.unshift({
            text: 'Не указан',
            val: null
        })
    }
    
    if(ctx.display) {
        return [
            {
                block: 'order',
                elem: 'body-row',
                content: [
                    {
                        block: 'order',
                        elem: 'body-row-name',
                        content: 'Тип клиента'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'select',
                                name: 'clientType',
                                mods: {
                                    mode: 'radio',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                val: order.info.clientType || null,
                                options: types
                            }
                        ]
                    }
                ]
            },
        ]
    }
})
