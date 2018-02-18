block('field').elem('cs-stop-organization').content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    if(ctx.display) {
        var value = order.date['cs-stop-organization'];
        var year = value.getFullYear();
        var month = value.getMonth() + 1;
        if(month < 10) {
            month = '0' + month;
        }
        var day = value.getDate();
        if(day < 10) {
            day = '0' + day;
        }

        return [
            {
                block: 'order',
                elem: 'body-row',
                content: [
                    {
                        block: 'order',
                        elem: 'body-row-name',
                        content: 'Контрольная дата активации сервиса'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: `${day}.${month}.${year}`
                    }
                ]
            }
        ]
    }
})
