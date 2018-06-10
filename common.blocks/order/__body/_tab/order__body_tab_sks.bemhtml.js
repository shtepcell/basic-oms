block('order').elem('body').elemMod('tab', 'gzp').content()(function () {

    var ctx = this.ctx,
        tab = ctx.tab,
        user = ctx.user,
        order = ctx.order,
        adminEdit = ctx.adminEdit;

    var mustFill = (order.status == 'sks-pre' || order.status == 'sks-build');

    return [
        {
            block: 'field',
            elem: 'date-sks-pre',
            order: order,
            dataset: dataset,
            display: order.date['sks-pre']
        },
        {
            block: 'field',
            elem: 'cs-sks-pre',
            order: order,
            dataset: dataset,
            display: order.date['cs-sks-pre']
        },
        {
            block: 'field',
            elem: 'date-sks-build',
            order: order,
            dataset: dataset,
            display: order.date['sks-build']
        },
        {
            block: 'field',
            elem: 'cs-sks-end',
            order: order,
            dataset: dataset,
            display: order.date['cs-sks-end']
        },
        {
            block: 'field',
            elem: 'date-sks-end',
            order: order,
            dataset: dataset,
            display: order.date['date-sks-end']
        },
        { elem: 'separator' },
        {
            elem: 'sks-info',
            elemMods: {
                access: (adminEdit || mustFill),
            },
            order: order,
            display: (mustFill || order.sks.capability)
        },
        {
            block: 'field',
            elem: 'sks-add-info',
            order: order,
            elemMods: {
                access: (adminEdit || mustFill),
            },
            dataset: dataset,
            display: (mustFill || order.sks.add_info)
        },
        {
            elem: 'actions',
            elemMods: {
                tab: 'sks'
            },
            order: order,
            adminEdit: adminEdit,
            user: this.ctx.user
        }
    ];
})
