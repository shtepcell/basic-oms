block('field').elem('relation').content()(function () {
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
                        content: 'Связанный заказ'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: {
                          block: 'link',
                          mods: {
                            theme: 'islands',
                            size: 'l'
                          },
                          url: `/order/${order.info.relation}`,
                          content: order.info.relation
                        }
                    }
                ]
            }
        ]
    }
})
