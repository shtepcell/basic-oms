block('field').elem('cms').content()(function () {
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
                        content: 'Номер CMS'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: `${order.info.cms}`
                    }
                ]
            }
        ]
    }
})

block('field').elem('cms').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    if(ctx.display) {
        return [
            {
                block: 'order',
                elem: 'body-row',
                content: [
                    {
                        block: 'order',
                        elem: 'body-row-name',
                        content: 'Номер CMS'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'input',
                                name: 'cms',
                                mods: {
                                    width: 'available',
                                    theme: 'islands',
                                    type: 'cms',
                                    size: 'l'
                                },
                                val: (order)?`${order.info.cms}`:'',
                                autocomplete: false,
                                placeholder: '__-______-__'
                            }
                        ]
                    }
                ]
            },
        ]
    }
})
