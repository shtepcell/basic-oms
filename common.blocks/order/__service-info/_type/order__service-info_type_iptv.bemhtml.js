block('order').elem('service-info').elemMod('type', 'iptv').content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    if(!order)
        order = {
            info: {}
        }

    return []
})

block('order').elem('service-info').elemMod('type', 'iptv').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    var title = 'Связанный заказ *';

    if(!order)
        order = {
            info: {}
        }

    if(order.info.relation && isNaN(order.info.relation)) title = 'Связанный заказ (некорректно указан) *'

    return [
        {
            elem: 'body-row',
            content: [
                {
                    elem: 'body-row-name',
                    content: title
                },
                {
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'input',
                            mods: {
                                theme: 'islands',
                                width: 'available',
                                size: 'l'
                            },
                            val: order.info.relation || '',
                            name: 'relation',
                            placeholder: 'ID заказа (1234)'
                        }
                    ]
                }
            ]
        }
    ]
})
