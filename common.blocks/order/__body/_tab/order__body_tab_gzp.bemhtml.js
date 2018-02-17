block('order').elem('body').elemMod('tab', 'gzp').content()(function () {

    var ctx = this.ctx,
        tab = ctx.tab,
        dataset = ctx.dataset,
        user = ctx.user,
        order = ctx.order,
        adminEdit = ctx.adminEdit;

    var isOwner = ( user.department.type == 'gus' &&
        user.department.cities.indexOf(order.info.city._id) >= 0);

    var mustFill = ( (order.status == 'gzp-pre' || order.status == 'all-pre') && isOwner);

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
            elem: 'cs-gzp-active',
            order: order,
            dataset: dataset,
            display: order.date['cs-gzp-organization']
        },
        {
            block: 'field',
            elem: 'date-gzp-active',
            order: order,
            dataset: dataset,
            display: order.date['network']
        },
        { elem: 'separator' },
        {
            block: 'field',
            elem: 'gzp-need',
            order: order,
            elemMods: {
                access: (adminEdit || mustFill),
            },
            dataset: dataset,
            display: (mustFill || order.gzp.complete)
        },
        {
            elem: 'gzp-info',
            elemMods: {
                need: (order.gzp.need)?'yes':'no',
                access: (adminEdit || mustFill),
            },
            order: order,
            display: (mustFill || order.gzp.complete)
        },
        {
            block: 'field',
            elem: 'gzp-add-info',
            order: order,
            elemMods: {
                access: (adminEdit || mustFill),
            },
            dataset: dataset,
            display: (mustFill || order.gzp.add_info)
        },
        {
            elem: 'actions',
            department: this.ctx.department,
            order: order,
            admin: adminEdit,
            user: this.ctx.user,
            tab: 'gzp'
        }
    ];
})
