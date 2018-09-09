block('field').elem('preVolume').content()(function () {
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
                        content: 'Текущая ёмкость'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: `${order.preVolume}`
                    }
                ]
            }
        ]
    }
})
