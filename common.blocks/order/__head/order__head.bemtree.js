block('order').elem('head').content()(function () {
    var order = this.ctx.order;
    var pause = null;


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
        {
            elem: 'head-cell',
            mix: [
                {
                    elem: 'right'
                },
                {
                    elem: (order.cs >= 0)?'green':'red'
                }
            ],
            content: [
                {
                    elem: 'cell-data',
                    content: `КС: ${order.cs} д.`
                }
            ]
        },
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
