block('order').elem('head').content()(function () {
    var order = this.ctx.order;
    var pause = null;
    var cs = null;

    if(order.deadline != null) {
        var now = new Date();
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
        var val = Math.round((order.deadline - now) / 1000 / 60 / 60 / 24);
        if(order.pause.deadline) {
            val = order.pause.deadline;
        }
        cs = {
            elem: 'head-cell',
            mix: [
                {
                    elem: 'right'
                },
                {
                    elem: (val >= 0)?(val<3)?'orange':'green':'red'
                }
            ],
            content: {
                elem: 'cell-data',
                content: `КС: ${val} д.`
            }
        }
    }

    if(order.pause.status) pause = {
        elem: 'head-cell',
        mix: {
            elem: 'pause'
        },
        content: [
            {
                elem: 'cell-data',
                content: 'На паузе'
            }
        ]
    };

    var ret = [
        {
            elem: 'head-cell',
            content: 'Заказ #' + order.id,
            mix: {
                elem: 'title'
            }
        },
        cs,
        {
            elem: 'head-wrapper',
            content: {
                elem: 'head-container',
                content: [
                    {
                        elem: 'head-cell',
                        content: [
                            {
                                elem: 'cell-name',
                                content: 'Этап'
                            },
                            {
                                elem: 'cell-data',
                                content: order.stage
                            }
                        ]
                    },
                    {
                        elem: 'head-cell',
                        content: [
                            {
                                elem: 'cell-name',
                                content: 'Ответственный за текущий этап отдел'
                            },
                            {
                                elem: 'cell-data',
                                content: order.resp
                            }
                        ]
                    }
                ]
            }
        },
        pause
    ]

    return ret;
})
