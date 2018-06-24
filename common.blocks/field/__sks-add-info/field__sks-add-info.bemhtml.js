block('field').elem('sks-add-info').content()(function () {
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
                        content: 'Дополнительная информация'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: order.info.add_info
                    }
                ]
            }
        ]
    }
})

block('field').elem('sks-add-info').elemMod('access', true).content()(function () {
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
                        content: 'Дополнительная информация'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'input',
                                name: 'add_info',
                                mods: {
                                    width: 'available',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                val: order.sks.add_info,
                                autocomplete: false,
                                placeholder: 'Доп. информация'
                            }
                        ]
                    }
                ]
            },
        ]
    }
})
