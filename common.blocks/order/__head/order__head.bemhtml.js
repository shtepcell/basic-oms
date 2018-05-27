block('order').elem('head').content()(function () {
    var order = this.ctx.order;
    var pause = '',
        link = null,
        resp = null;

    if(order.pause.status) pause = ' (на паузе)';

    if(order.resp != null) {
        resp = {
            elem: 'head-item',
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
    }

    if(order.isOld)
        link = {
            elem: 'head-item',
            content: [
                {
                    elem: 'cell-name',
                    content: 'Заявка в основном СУЗ-е'
                },
                {
                    elem: 'cell-data',
                    content: {
                        block: 'link',
                        mods: {
                            theme: 'islands'
                        },
                        attrs: {
                            target: '_blank'
                        },
                        url: `http://ops.miranda-media.ru/orders/${order.id}`,
                        content: 'Ссылка'
                    }
                }
            ]
        }


    return [
        {
            elem: 'head-cell',
            elemMods: {
                type: 'left'
            },
            content: {
                elem: 'id',
                id: order.id
            }
        },
        {
            elem: 'head-cell',
            elemMods: {
                type: 'center'
            },
            content: [
                {
                    elem: 'head-cell',
                    elemMods: {
                        type: 'top'
                    },
                    content: [
                        link,
                        {
                            elem: 'head-item',
                            content: [
                                {
                                    elem: 'cell-name',
                                    content: 'Этап'
                                },
                                {
                                    elem: 'cell-data',
                                    content: order.stage + pause
                                }
                            ]
                        },
                        resp
                    ]
                },
                {
                    elem: 'head-cell',
                    elemMods: {
                        type: 'bottom'
                    },
                    content: {
                        elem: 'switcher',
                        order: order,
                        tab: this.ctx.tab
                    }

                }
            ]
        },
        {
            elem: 'head-cell',
            elemMods: {
                type: 'right'
            },
            content: {
                elem: 'cs',
                cs: order.cs
            }
        }
    ]
})
