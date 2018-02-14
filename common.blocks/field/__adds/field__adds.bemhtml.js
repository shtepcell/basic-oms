block('field').elem('adds').content()(function () {
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
                        content: 'д./кв. и т.д'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: `${order.info.adds}`
                    }
                ]
            }
        ]
    }
})

block('field').elem('adds').elemMod('access', true).content()(function () {
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
                        content: 'д./кв. и т.д *'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'input',
                                name: 'adds',
                                mods: {
                                    width: 'available',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                val: `${order.info.adds}`,
                                autocomplete: false,
                                placeholder: 'д.32, кв.15'
                            }
                        ]
                    }
                ]
            },
        ]
    }
})
