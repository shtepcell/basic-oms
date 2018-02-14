block('field').elem('gzp-need').content()(function () {
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
                        content: 'Необходимость ГЗП'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: order.gzp.need
                    }
                ]
            }
        ]
    }
})

block('field').elem('gzp-need').elemMod('access', true).content()(function () {
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
                        content: 'Небходимость ГЗП'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'select',
                                name: 'need',
                                mix: {
                                    block: 'action',
                                    elem: 'change-gzp-need',
                                    js: true
                                },
                                mods: {
                                    mode: 'radio',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                val: order.gzp.need,
                                options: [
                                    {
                                        text: 'Да',
                                        val: 1
                                    },
                                    {
                                        text: 'Нет',
                                        val: 0
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
