block('order').elem('body').elemMod('tab', 'gzp').content()(function () {

    var ctx = this.ctx,
        tab = ctx.tab,
        dataset = ctx.dataset,
        user = ctx.user,
        order = ctx.order,
        adminEdit = ctx.adminEdit;

    return [
        {
            block: 'field',
            elem: 'date-gzp-pre',
            order: order,
            dataset: dataset,
            display: order.date['gzp-pre']
        },
        {
            block: 'field',
            elem: 'cs-gzp-pre',
            order: order,
            dataset: dataset,
            display: order.date['cs-gzp-pre']
        },
        {
            block: 'field',
            elem: 'date-gzp-build',
            order: order,
            dataset: dataset,
            display: order.date['gzp-build']
        },
        {
            block: 'field',
            elem: 'date-gzp-active',
            order: order,
            dataset: dataset,
            display: order.date['network']
        },
        {
            block: 'field',
            elem: 'cs-gzp-active',
            order: order,
            dataset: dataset,
            display: order.date['cs-gzp-organization']
        },
        { elem: 'separator' },
        {
            block: 'field',
            elem: 'gzp-need',
            order: order,
            elemMods: {
                access: (adminEdit || ((order.status == 'gzp-pre' || order.status == 'all-pre') && user.department.type == 'gus' &&
                    user.department.cities.indexOf(order.info.city._id) >= 0)),
            },
            dataset: dataset,
            display: true
        },
        {
            elem: 'gzp-info',
            elemMods: {
                need: 'yes',
                access: (adminEdit || ((order.status == 'gzp-pre' || order.status == 'all-pre') && user.department.type == 'gus' &&
                    user.department.cities.indexOf(order.info.city._id) >= 0)),
            },
            order: order
        },
        {
            block: 'field',
            elem: 'gzp-add-info',
            order: order,
            elemMods: {
                access: (adminEdit || ((order.status == 'gzp-pre' || order.status == 'all-pre') && user.department.type == 'gus' &&
                    user.department.cities.indexOf(order.info.city._id) >= 0)),
            },
            dataset: dataset,
            display: true
        }
    ];
})
