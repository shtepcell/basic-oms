block('orders-table')(
    content()(function () {
        var ctx = this.ctx,
            orders = ctx.orders,
            body = {};

        if(orders && orders.length) {
            body = {
                elem: 'body',
                services: ctx.services,
                flags: ctx.flags,
                orders: ctx.orders
            };
        }

        return [
            // {
            //     elem: 'title',
            //     count: ctx.count
            // },
            {
                elem: 'head',
                params: ctx.params
            },
            body
        ]
    })
)
