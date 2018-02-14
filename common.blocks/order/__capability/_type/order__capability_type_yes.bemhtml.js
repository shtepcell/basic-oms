block('order').elem('capability').elemMod('type', 'yes').content()(function () {
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
                    content: this.ctx.order.gzp.time
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
                    content: 'Одноразовая стоимость организации'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: this.ctx.order.gzp['cost-once']
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
                    content: this.ctx.order.gzp['cost-monthly']
                }
            ]
        }
    ]
})

block('order').elem('capability').elemMod('type', 'yes').elemMod('access', true).content()(function () {
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
                            size: 'l'
                        },
                        name: 'time',
                        placeholder: '30',
                        val: this.ctx.order.gzp.time
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
                    content: 'Одноразовая стоимость организации'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: {
                        block: 'order',
                        elem: 'body-row-data',
                        content: {
                            block: 'input',
                            mods: {
                                theme: 'islands',
                                size: 'l'
                            },
                            name: 'cost-once',
                            placeholder: '10000',
                            val: this.ctx.order.gzp['cost-once']
                        }
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
                        block: 'order',
                        elem: 'body-row-data',
                        content: {
                            block: 'input',
                            mods: {
                                theme: 'islands',
                                size: 'l'
                            },
                            name: 'cost-monthly',
                            placeholder: '10000',
                            val: this.ctx.order.gzp['cost-monthly']
                        }
                    }
                }
            ]
        }
    ]
})
