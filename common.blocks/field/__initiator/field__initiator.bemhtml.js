block('field').elem('initiator').content()(function () {
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
                        content: 'Инициатор заказа'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: `${order.info.initiator.name} [${order.info.initiator.department.name}]`
                    }
                ]
            }
        ]
    }
})
