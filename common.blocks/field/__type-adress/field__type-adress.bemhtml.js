block('field').elem('type-adress').content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

    return;
})

block('field').elem('type-adress').elemMod('access', true).content()(function () {
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
                        content: 'Метод указания адреса'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'radio-group',
                                mods: {
                                    theme: 'islands',
                                    size: 'm',
                                    type: 'button'
                                },
                                mix: {
                                    block: 'action',
                                    elem: 'change-adress',
                                    js: {
                                        dataset: dataset
                                    }
                                },
                                val: 'location',
                                name: 'adressType',
                                options: [
                                    {
                                        val: 'location',
                                        text: 'Улица, дом и т.д.'
                                    },
                                    {
                                        val: 'coordination',
                                        text: 'По координатам'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
        ]
    }
})
