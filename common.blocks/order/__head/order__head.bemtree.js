block('order').elem('head').content()(function () {
    var order = this.ctx.order;
    var pause = null;
    var cs = null;

    if(order.deadline != null) {

        var val = Math.round((order.deadline - new Date()) / 1000 / 60 / 60 / 24);
        cs = {
            elem: 'head-cell',
            mix: [
                {
                    elem: 'right'
                },
                {
                    elem: (val >= 0)?'green':'red'
                }
            ],
            content: {
                elem: 'cell-data',
                content: `КС: ${val} д.`
            }
        }
    }

    if(!order.pause) pause = {
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
            content: 'Заявка №' + order.id,
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
                                content: 'Номер CMS'
                            },
                            {
                                elem: 'cell-data',
                                content: order.info.cms
                            }
                        ]
                    },
                    {
                        elem: 'head-cell',
                        content: [
                            {
                                elem: 'cell-name',
                                content: 'Клиент'
                            },
                            {
                                elem: 'cell-data',
                                content: `[${order.info.client.type.shortName}] ${order.info.client.name}`
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
