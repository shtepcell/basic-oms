block('order').elem('gzp-info').elemMod('need', 'yes').content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    if(!order) {
        order = {
            gzp: {
                capability: false
            }
        }
    }
    return [
        {
            block: 'order',
            elem: 'body-row',
            content: [
                {
                    elem: 'body-row-name',
                    content: 'Техническая возможность'
                },
                {
                    elem: 'body-row-data',
                    content: (order.gzp.capability)?'Да':'Нет'
                }
            ]

        },
        {
            block: 'order',
            elem: 'capability',
            order: order,
            elemMods: {
                type: (order.gzp.capability)?'yes':'no'
            }
        }
    ]
})

block('order').elem('gzp-info').elemMod('need', 'yes').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order;


    if(!order) {
        order = {
            gzp: {
                capability: false
            }
        }
    }

    return [
        {
            block: 'order',
            elem: 'body-row',
            content: [
                {
                    elem: 'body-row-name',
                    content: 'Техническая возможность'
                },
                {
                    elem: 'body-row-data',
                    content: {
                        block: 'select',
                        mix: {
                            block: 'action',
                            elem: 'change-tech',
                            js: true
                        },
                        name: 'capability',
                        mods: {
                            theme: 'islands',
                            mode: 'radio',
                            size: 'l'
                        },
                        options: [
                            {
                                text: 'Нет',
                                val: 0
                            },
                            {
                                text: 'Да',
                                val: 1
                            }
                        ]
                    }
                }
            ]

        },
        {
            block: 'order',
            elem: 'capability',
            order: order,
            elemMods: {
                access: true,
                type: (order.gzp.capability)?'yes':'no'
            }
        }
    ]
})
