block('orders-table')(
    content()(function () {
        var ctx = this.ctx;

        return [
            // {
            //     elem: 'title',
            //     count: ctx.count
            // },
            {
                elem: 'head',
                params: ctx.params
            },
            {
                elem: 'body',
                services: ctx.services,
                flags: ctx.flags,
                orders: ctx.orders
            }
        ]
    })
)
