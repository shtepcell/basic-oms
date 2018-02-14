block('field').elem('contact').content()(function () {
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
                        content: 'Контактные данные клиента'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: `${order.info.contact}`
                    }
                ]
            }
        ]
    }
})

block('field').elem('contact').elemMod('access', true).content()(function () {
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
                        content: 'Контактные данные клиента *'
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
                                val: order.info.contact,
                                autocomplete: false,
                                placeholder: 'Номер телефона и другая информация'
                            }
                        ]
                    }
                ]
            },
        ]
    }
})
