block('order').elem('body').elemMod('tab', 'sks').content()(function () {
    const { user, order, adminEdit, dataset } = this.ctx;
    const mustFill = (order.status == 'sks-pre' && user.department.type == 'sks') || (order.status == 'pre' && user.department.type == 'net') ;

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
            elem: 'cs-sks-active',
            order: order,
            dataset: dataset,
            display: order.date['cs-sks-organization']
        },
        {
            block: 'field',
            elem: 'date-sks-active',
            order: order,
            dataset: dataset,
            display: order.date['network'] && order.date['sks-build']
        },
        { elem: 'separator' },
        {
            block: 'field',
            elem: 'sks-time',
            elemMods: {
                access: (adminEdit || mustFill),
            },
            order: order,
            display: (mustFill || order.sks.time != undefined)
        },
        {
            block: 'field',
            elem: 'sks-cost-once',
            elemMods: {
                access: (adminEdit || mustFill),
            },
            order: order,
            display: (mustFill || order.sks.time != undefined)
        },
        {
            block: 'field',
            elem: 'sks-cost-monthly',
            elemMods: {
                access: (adminEdit || mustFill),
            },
            order: order,
            display: (mustFill ||  order.sks.time != undefined)
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
