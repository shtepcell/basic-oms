block('field').elem('zone').content()(function () {
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
                        content: 'Зона ответсвенности'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: order.zone
                    }
                ]
            }
        ]
    }
})
