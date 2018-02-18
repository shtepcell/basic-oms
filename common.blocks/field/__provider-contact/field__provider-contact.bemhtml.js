block('field').elem('provider-contact').content()(function () {
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
                        content: 'Контакт с провайдером'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: order.stop.contact
                    }
                ]
            }
        ]
    }
})

block('field').elem('provider-contact').elemMod('access', true).content()(function () {
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
                        content: 'Контакт с провайдером *'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'input',
                                name: 'contact',
                                mods: {
                                    width: 'available',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                val: order.stop.contact,
                                autocomplete: false,
                                placeholder: 'Контактные данные'
                            }
                        ]
                    }
                ]
            },
        ]
    }
})
