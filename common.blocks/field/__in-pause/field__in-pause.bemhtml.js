block('field').elem('in-pause').content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    if(ctx.display) {
        var now = new Date();
        var pause = order.pause.date;
        pause = Math.round((now - pause) / 1000 / 60 / 60 / 24);

        return [
            {
                block: 'order',
                elem: 'body-row',
                content: [
                    {
                        block: 'order',
                        elem: 'body-row-name',
                        content: 'Длительность паузы (дней)'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: pause
                    }
                ]
            }
        ]
    }
})
