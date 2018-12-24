block('field').elem('odf').content()(function () {
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
                        content: 'ODF'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: order.gzp.odf
                    }
                ]
            }
        ]
    }
})

block('field').elem('odf').elemMod('access', true).content()(function () {
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
                        content: 'ODF'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'input',
                                name: 'odf',
                                mods: {
                                    width: 'available',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                val: order.info.odf,
                                autocomplete: false,
                                placeholder: 'ODF'
                            }
                        ]
                    }
                ]
            },
        ]
    }
})
