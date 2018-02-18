block('field').elem('idoss').content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

    if(ctx.display) {
        return [
            {
                block: 'order',
                elem: 'body-row',
                content: [
                    {
                        block: 'order',
                        elem: 'body-row-name',
                        content: 'ID OSS'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: `${order.info.idoss}`
                    }
                ]
            }
        ]
    }
})

block('field').elem('idoss').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

    if(ctx.display) {
        return [
            {
                block: 'order',
                elem: 'body-row',
                content: [
                    {
                        block: 'order',
                        elem: 'body-row-name',
                        content: 'ID OSS*'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'input',
                                name: 'idoss',
                                mods: {
                                    width: 'available',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                val: order.info.idoss,
                                autocomplete: false,
                                placeholder: '123'
                            }
                        ]
                    }
                ]
            }
        ]
    }
})
