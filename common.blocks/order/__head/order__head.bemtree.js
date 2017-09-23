block('order').elem('head').content()(function () {
    var ret = [
        {
            elem: 'head-cell',
            content: 'Заявка №' + this.ctx.order.id,
            mix: {
                elem: 'title'
            }
        },
        {
            elem: 'head-cell',
            mix: {
                elem: 'right'
            },
            content: [
                {
                    elem: 'cell-data',
                    content: 'КС: 12 дней'
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
                                content: this.ctx.order.status
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
                                content: '123123'
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
                                content: 'Федеральное государственное бюджетное военное образовательное учреждение высшего образования "Черноморское высшее военно-морское ордена Красной Звезды училище имени П.С. Нахимова" Министерства обороны Российской Федерации (г. Севастополь)'
                                // content: `[${this.ctx.order.info.client.type.shortName}] ${this.ctx.order.info.client.name}`
                            }
                        ]
                    }
                ]
            }
        },
        {
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
        }
    ]
    // ret.forEach( (item, i) => {
    //     if(item.content[1].content == null) {
    //         ret[i] = undefined;
    //     }
    // })
    return ret;
})
