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
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Выберите один из вариантов'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.g70x
                }
            ]
        },
        {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Связанный заказ'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.relation
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
            block: 'order',
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Выберите один из вариантов'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'select',
                            name: 'g70x',
                            mods: {
                                mode: 'radio',
                                theme: 'islands',
                                size: 'l'
                            },
                            val: order.info.g70x,
                            options: [
                                {
                                    text: 'G.701',
                                    val: 'G.701'
                                },
                                {
                                    text: 'G.703',
                                    val: 'G.703'
                                }
                            ]
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
                    content: 'Связанный заказ *'
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
                            val: order.info.relation || '',
                            name: 'relation',
                            placeholder: ''
                        }
                    ]
                }
            ]
        },
    ]
})
