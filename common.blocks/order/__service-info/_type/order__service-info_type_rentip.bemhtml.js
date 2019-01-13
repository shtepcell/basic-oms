block('order').elem('service-info').elemMod('type', 'rentip').content()(function () {
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
                    content: 'Prefix'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.pref
                }
            ]
        }
    ]
})


block('order').elem('service-info').elemMod('type', 'rentip').elemMod('access', true).content()(function () {
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
                    content: 'Prefix'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'select',
                            name: 'pref',
                            mods: {
                                mode: 'radio',
                                theme: 'islands',
                                size: 'l'
                            },
                            val: order.info.pref,
                            options: [
                                {
                                    text: '/29',
                                    val: '/29'
                                },
                                {
                                    text: '/28',
                                    val: '/28'
                                },
                                {
                                    text: '/27',
                                    val: '/27'
                                },
                                {
                                    text: '/26',
                                    val: '/26'
                                },
                                {
                                    text: '/25',
                                    val: '/25'
                                },
                                {
                                    text: '/24',
                                    val: '/24'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
})
