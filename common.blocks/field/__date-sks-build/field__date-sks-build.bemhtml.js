block('field').elem('date-sks-build').content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    if(ctx.display) {
        var value = order.date['sks-build'];
        var year = value.getFullYear();
        var month = value.getMonth() + 1;
        if(month < 10) {
            month = '0' + month;
        }
        var day = value.getDate();
        if(day < 10) {
            day = '0' + day;
        }
        var val = `${day}.${month}.${year}`;

        return [
            {
                block: 'order',
                elem: 'body-row',
                content: [
                    {
                        block: 'order',
                        elem: 'body-row-name',
                        content: 'Фактическая дата организации сервиса'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: val
                    }
                ]
            }
        ]
    }
})
