block('field').elem('node').content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    if (ctx.display) {
        return [
            {
                block: 'order',
                elem: 'body-row',
                content: [
                    {
                        block: 'order',
                        elem: 'body-row-name',
                        content: 'Узел агрегации'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: order.gzp.node
                    }
                ]
            }
        ]
    }
})

block('field').elem('node').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    if (ctx.display) {
        return [
            {
                block: 'order',
                elem: 'body-row',
                content: [
                    {
                        block: 'order',
                        elem: 'body-row-name',
                        content: 'Узел агрегации'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'input',
                                name: 'node',
                                mods: {
                                    width: 'available',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                val: order.info.node,
                                autocomplete: false,
                                placeholder: 'Узел агрегации'
                            }
                        ]
                    }
                ]
            },
        ]
    }
})
