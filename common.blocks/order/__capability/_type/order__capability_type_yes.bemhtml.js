block('order').elem('capability').elemMod('type', 'yes').content()(function () {

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
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Срок организации'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.gzp.time
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
                    content: 'Единоразовая стоимость организации'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.gzp['cost-once']
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
                    content: 'Операционные затраты ежемесячные'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.gzp['cost-monthly']
                }
            ]
        }
    ]
})

block('order').elem('capability').elemMod('type', 'yes').elemMod('access', true).content()(function () {
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
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Срок организации'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: {
                        block: 'input',
                        mods: {
                            theme: 'islands',
                            size: 'l',
                            width: 'available'
                        },
                        name: 'time',
                        placeholder: '30',
                        val: order.gzp.time
                    }
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
                    content: 'Единоразовая стоимость организации'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: {
                        block: 'input',
                        mods: {
                            theme: 'islands',
                            size: 'l',
                            width: 'available'
                        },
                        name: 'cost-once',
                        placeholder: '10000',
                        val: order.gzp['cost-once']
                    }
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
                    content: 'Операционные затраты ежемесячные'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: {
                        block: 'input',
                        mods: {
                            theme: 'islands',
                            size: 'l',
                            width: 'available'
                        },
                        name: 'cost-monthly',
                        placeholder: '10000',
                        val: order.gzp['cost-monthly']
                    }
                }
            ]
        }
    ]
})
