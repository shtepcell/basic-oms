block('field').elem('date-request').content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

    if(ctx.display) {
        var value = order.info['date-request'];
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
                        content: 'Необходимая дата реализации'
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

block('field').elem('date-request').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

    if(ctx.display) {
        var value;
        var val = '';

        if(order) {
          value = order.info['date-request'];
          if(value) {
            var year = value.getFullYear();
            var month = value.getMonth() + 1;
            if(month < 10) {
                month = '0' + month;
            }
            var day = value.getDate();
            if(day < 10) {
                day = '0' + day;
            }
            val = `${day}.${month}.${year}`;
          }
        }
        
        return [
            {
                block: 'order',
                elem: 'body-row',
                content: [
                    {
                        block: 'order',
                        elem: 'body-row-name',
                        content: 'Необходимая дата реализации'
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
                                val: val,
                                name: 'date-request',
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
