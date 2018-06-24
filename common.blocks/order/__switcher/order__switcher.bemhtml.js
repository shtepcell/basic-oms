block('order').elem('switcher').content()(function () {
    var order = this.ctx.order,
        tab = this.ctx.tab;

    var gzpMustShow = (order.status == 'gzp-pre' || order.status == 'all-pre' || order.gzp.need !== undefined),
        stopMustShow = (order.status == 'stop-pre' || order.status == 'all-pre' || order.stop.capability !== undefined);
        sksMustShow = (order.status == 'sks-pre' || order.sks.time != undefined);

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
                display: sksMustShow,
                active: (tab=='sks')
            },
            content: 'СКС',
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
