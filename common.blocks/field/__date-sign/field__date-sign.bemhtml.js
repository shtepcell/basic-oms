block('field').elem('date-sign').content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

    if(ctx.display) {
        var value = order.info['date-sign'];
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
                        content: 'Дата подписания договора'
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

block('field').elem('date-sign').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

    if(ctx.display) {
        var value;

        var value = order.info['date-sign'] || new Date();
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
                        content: 'Дата подписания договора'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'input',
                                mods: {
                                    'has-calendar': true,
                                    size: 'm',
                                    theme: 'islands'
                                },
                                val: `${day}.${month}.${year}`,
                                name: 'date-sign',
                                weekdays: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
                                months: ['Январь', 'Февраль', 'Март',
                                    'Апрель', 'Май', 'Июнь',
                                    'Июль', 'Август', 'Сентябрь',
                                    'Октябрь', 'Ноябрь', 'Декабрь']
                            }
                        ]
                    }
                ]
            }
        ]
    }
})
