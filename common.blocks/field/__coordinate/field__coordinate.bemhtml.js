block('field').elem('coordinate').content()(function () {
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
                        content: 'Координаты'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: `${order.info.coordinate}`
                    }
                ]
            }
        ]
    }
})

block('field').elem('coordinate').elemMod('access', true).content()(function () {
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
                        content: 'Координаты *'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'input',
                                name: 'coordinate',
                                mods: {
                                    width: 'available',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                val: (order)?`${order.info.coordinate}`:'',
                                autocomplete: false,
                                placeholder: '55,755831°, 37,617673°'
                            }
                        ]
                    }
                ]
            },
        ]
    }
})
