block('field').elem('tech').content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

    if(ctx.display)
    return [
        {
            block: 'order',
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Техническая возможность'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: (!!order.stop.capability)?'Да':'Нет'
                }
            ]
        }
    ]
})

block('field').elem('tech').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

    if(ctx.display)
    return [
        {
            block: 'order',
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Техническая возможность'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'select',
                            name: 'capability',
                            mix: {
                                block: 'action',
                                elem: 'change-stop-capability',
                                js: {
                                    order: {
                                        stop: order.stop
                                    },
                                    dataset: {
                                        providers: dataset.providers
                                    }
                                }
                            },
                            mods: {
                                mode: 'radio',
                                theme: 'islands',
                                size: 'l'
                            },
                            val: order.stop.capability,
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
                    ]
                }
            ]
        }
    ]
})
