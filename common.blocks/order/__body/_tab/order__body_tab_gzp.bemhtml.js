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
    if(!order.date['cs-gzp-pre'])
        return 'Информации по ГЗП нет!'
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
            display: order.date['network'] && order.gzp['gzp-build']
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
            display: (mustFill || order.gzp.need != undefined)
        },
        {
            elem: 'gzp-info',
            elemMods: {
                need: ((order.gzp.need == undefined)?1:order.gzp.need)?'yes':'no',
                access: (adminEdit || mustFill),
            },
            order: order,
            display: (mustFill || order.gzp.need != undefined)
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
            elemMods: {
                tab: 'gzp'
            },
            order: order,
            adminEdit: adminEdit,
            user: this.ctx.user
        }
    ];
})
