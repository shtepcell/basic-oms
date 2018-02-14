block('order').elem('service-info').elemMod('type', 'internet').content()(function () {
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
        },
        {
            elem: 'body-row',
            content: [
                {
                    elem: 'body-row-name',
                    content: 'Количество IP адресов'
                },
                {
                    elem: 'body-row-data',
                    content: order.info.ip || ''
                }
            ]
        }
    ]
})


block('order').elem('service-info').elemMod('type', 'internet').elemMod('access', true).content()(function () {
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
        },
        {
            elem: 'body-row',
            content: [
                {
                    elem: 'body-row-name',
                    content: 'Количество IP адресов'
                },
                {
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'select',
                            elem: 'ip',
                            val: order.info.ip || null
                        }
                    ]
                }
            ]
        }
    ]
})
