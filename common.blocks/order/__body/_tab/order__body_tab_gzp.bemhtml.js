block('order').elem('body').elemMod('tab', 'gzp').content()(function () {

    var ctx = this.ctx,
        dataset = ctx.dataset,
        user = ctx.user,
        order = ctx.order,
        adminEdit = ctx.adminEdit;

    var isOwner = order.resp.includes(user.department.name);

    var mustFill = ((order.status == 'gzp-pre' || order.status == 'all-pre') && isOwner);
    const onGoToNet = ((order.status == 'gzp-build' || order.status == 'install-devices') && isOwner);

    if (!order.date['cs-gzp-pre']) {
        return 'Информации по ГЗП нет!'
    }

    const isShortPath = order.info.client.shortName == 'SOHO' || order.info.service == "sks" || order.info.service == "devices" || order.info.service == "rrl";

    return [
        order.tech.private && {
            elem: 'banner',
            content: 'ОГРАНИЧЕННЫЙ ДОСТУП',
        },
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
            display: order.date['gzp-build'] || order.date['install-devices']
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
            display: isShortPath ? order.date['install-devices'] : order.date['network'] && order.gzp['gzp-build']
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
                need: ((order.gzp.need == undefined) ? 1 : order.gzp.need) ? 'yes' : 'no',
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
            block: 'field',
            elem: 'odf',
            order: order,
            elemMods: {
                access: (adminEdit || onGoToNet),
            },
            dataset: dataset,
            display: (onGoToNet || order.gzp.odf)
        },
        {
            block: 'field',
            elem: 'node',
            order: order,
            elemMods: {
                access: (adminEdit || onGoToNet),
            },
            dataset: dataset,
            display: (onGoToNet || order.gzp.node)
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
