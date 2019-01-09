block('order').elem('service-info').elemMod('type', 'cloud').content()(function () {
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
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Количество линий'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.countOfLines
                }
            ]
        },
        {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Количество номеров (внутренних и внешних)'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.countOfNumbers
                }
            ]
        }
    ]
})


block('order').elem('service-info').elemMod('type', 'cloud').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    if(!order)
        order = {
            info: {}
        }

    return [
        {
            block: 'order',
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Количество линий'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'input',
                            mods: {
                                theme: 'islands',
                                width: 'available',
                                size: 'l'
                            },
                            val: order.info.countOfLines || '',
                            name: 'countOfLines',
                            placeholder: ''
                        }
                    ]
                }
            ]
        },
        {
            block: 'order',
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Количество номеров (внутренних и внешних)'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'input',
                            mods: {
                                theme: 'islands',
                                width: 'available',
                                size: 'l'
                            },
                            val: order.info.countOfNumbers || '',
                            name: 'countOfNumbers',
                            placeholder: ''
                        }
                    ]
                }
            ]
        }
    ]
})
