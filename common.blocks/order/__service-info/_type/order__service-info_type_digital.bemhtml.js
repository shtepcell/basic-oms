block('order').elem('service-info').elemMod('type', 'digital').content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    if(!order)
        order = {
            info: {}
        }

    return [
        {
            elem: 'body-row',
            content: [
                {
                    elem: 'body-row-name',
                    content: 'Ёмкость'
                },
                {
                    elem: 'body-row-data',
                    content: order.info.volume || ''
                }
            ]
        }
    ]
})


block('order').elem('service-info').elemMod('type', 'digital').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    if(!order)
        order = {
            info: {}
        }

    return [
        {
            elem: 'body-row',
            content: [
                {
                    elem: 'body-row-name',
                    content: 'Ёмкость'
                },
                {
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'select',
                            elem: 'volume',
                            val: order.info.volume || null
                        }
                    ]
                }
            ]
        }
    ]
})
