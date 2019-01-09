block('order').elem('service-info').elemMod('type', 'iptv').content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    if(!order)
        order = {
            info: {}
        }

    return [{
        elem: 'body-row',
        content: [
            {
                block: 'order',
                elem: 'body-row-name',
                content: 'Метод предоставления'
            },
            {
                block: 'order',
                elem: 'body-row-data',
                content: order.info.presentationMethod
            }
        ]
    }];
})

block('order').elem('service-info').elemMod('type', 'iptv').elemMod('access', true).content()(function () {
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
                    content: 'Метод предоставления'
                },
                {
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'select',
                            name: 'presentationMethod',
                            mods: {
                                mode: 'radio',
                                theme: 'islands',
                                size: 'l'
                            },
                            val: order.info.presentationMethod || null,
                            options: [
                                {
                                    text: 'ОТТ',
                                    val: 'ОТТ'
                                },
                                {
                                    text: 'MCAST',
                                    val: 'MCAST'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
})
