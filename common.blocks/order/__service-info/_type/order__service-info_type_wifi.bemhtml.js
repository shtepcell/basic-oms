block('order').elem('service-info').elemMod('type', 'wifi').content()(function () {
    var ctx = this.ctx,
        order = ctx.order || { info: {} };

    return [
        {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Mikrotik'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.mikrotik
                }
            ]
        },
        {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Интернет'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.internet
                }
            ]
        },
        {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Требуется согласование IP-адресного плана с клиентом?'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.needAgree
                }
            ]
        }
    ]
})


block('order').elem('service-info').elemMod('type', 'wifi').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order || { info: {} };

    return [
        {
            block: 'order',
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Mikrotik'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'select',
                            name: 'mikrotik',
                            mods: {
                                mode: 'radio',
                                theme: 'islands',
                                size: 'l'
                            },
                            val: order.info.mikrotik,
                            options: [
                                {
                                    text: 'Клиента',
                                    val: 'Клиента'
                                },
                                {
                                    text: 'ММ',
                                    val: 'ММ'
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
                    content: 'Интернет'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'select',
                            name: 'internet',
                            mods: {
                                mode: 'radio',
                                theme: 'islands',
                                size: 'l'
                            },
                            val: order.info.internet,
                            options: [
                                {
                                    text: 'ММ',
                                    val: 'ММ'
                                },
                                {
                                    text: 'СТОП',
                                    val: 'СТОП'
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
                    content: 'Требуется согласование IP-адресного плана с клиентом?'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'select',
                            name: 'needAgree',
                            mods: {
                                mode: 'radio',
                                theme: 'islands',
                                size: 'l'
                            },
                            val: order.info.needAgree,
                            options: [
                                {
                                    text: 'Да',
                                    val: 'Да'
                                },
                                {
                                    text: 'Нет',
                                    val: 'Нет'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
})
