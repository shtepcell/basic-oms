block('order').elem('switcher').content()(function () {
    var order = this.ctx.order,
        tab = this.ctx.tab;

    const gzpStages = [
        'gzp-pre',
        'all-pre',
        'rrl-pre'
    ];

    const gzpMustShow = gzpStages.includes(order.status) || order.gzp.need !== undefined;
    const stopMustShow = order.status == 'stop-pre' || order.status == 'all-pre' || order.stop.capability !== undefined;
    const preMustShow = order.status == 'pre' || order.status == 'sks-pre' || order.sks.time != undefined;

    return [
        {
            elem: 'tab',
            elemMods: {
                display: true,
                active: (tab=='info')
            },
            content: 'Инфо',
            url: `/order/${order.id}/info`
        },
        {
            elem: 'tab',
            elemMods: {
                display: gzpMustShow,
                active: (tab=='gzp')
            },
            content: 'ГЗП',
            url: `/order/${order.id}/gzp`
        },
        {
            elem: 'tab',
            elemMods: {
                display: preMustShow,
                active: (tab === 'sks')
            },
            content: 'Проработка',
            url: `/order/${order.id}/sks`
        },
        {
            elem: 'tab',
            elemMods: {
                display: stopMustShow,
                active: (tab=='stop')
            },
            content: 'СТОП',
            url: `/order/${order.id}/stop`
        },
        {
            elem: 'tab',
            elemMods: {
                display: true,
                active: (tab=='history')
            },
            content: 'Журнал',
            url: `/order/${order.id}/history`
        }
    ]
})
