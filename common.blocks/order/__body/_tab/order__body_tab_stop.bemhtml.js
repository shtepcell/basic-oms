block('order').elem('body').elemMod('tab', 'stop').content()(function () {

    var ctx = this.ctx,
        tab = ctx.tab,
        dataset = ctx.dataset,
        user = ctx.user,
        order = ctx.order,
        adminEdit = ctx.adminEdit;


    var isOwner = (user.department.type == 'b2o'),
        isPre = (order.status == 'all-pre' || order.status == 'stop-pre');

    if(!order.date['cs-stop-pre'])
        return 'Информации по ГЗП нет!'
    return [
        {
            block: 'field',
            elem: 'cs-stop-pre',
            order: order,
            dataset: dataset,
            display: order.date['cs-stop-pre']
        },
        {
            block: 'field',
            elem: 'date-stop-pre',
            order: order,
            dataset: dataset,
            display: order.date['stop-pre']
        },
        {
            block: 'field',
            elem: 'cs-stop-organization',
            order: order,
            dataset: dataset,
            display: order.date['cs-stop-organization']
        },
        {
            block: 'field',
            elem: 'date-stop-build',
            order: order,
            dataset: dataset,
            display: order.date['stop-build']
        },
        {
            block: 'field',
            elem: 'date-stop-organization',
            order: order,
            dataset: dataset,
            display: order.date['network'] && order.date['stop-build']
        },
        {
            block: 'field',
            elem: 'date-stop-build',
            order: order,
            dataset: dataset,
            display: order.date['stop-build']
        },
        { elem: 'separator' },
        {
            block: 'field',
            elem: 'tech',
            elemMods: {
                access: (isOwner && isPre)
            },
            order: order,
            dataset: dataset,
            display: (order.stop.complete || (isOwner && isPre))
        },
        {
            elem: 'stop-info',
            elemMods: {
                capability: (order.stop.capability)?'yes':'no',
                access: (isOwner && isPre)
            },
            order: order,
            dataset: dataset,
            display: (order.stop.complete || (isOwner && isPre))
        },
        {
            elem: 'actions',
            elemMods: {
                tab: 'stop'
            },
            order: order,
            adminEdit: adminEdit,
            user: this.ctx.user
        }
    ];
})
