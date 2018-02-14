block('order').elem('body').elemMod('tab', 'info').content()(function () {

    var ctx = this.ctx,
        tab = ctx.tab,
        dataset = ctx.dataset,
        user = ctx.user,
        order = ctx.order,
        adminEdit = ctx.adminEdit;

    return [
        {
            block: 'field',
            elem: 'client',
            order: order,
            elemMods: {
                access: adminEdit
            },
            dataset: dataset,
            display: true
        },
        {
            block: 'field',
            elem: 'contact',
            order: order,
            elemMods: {
                access: adminEdit
            },
            display: true
        },
        { elem: 'separator' },
        {
            block: 'field',
            elem: 'city',
            order: order,
            elemMods: {
                access: adminEdit
            },
            dataset: dataset,
            display: true
        },
        {
            block: 'field',
            elem: 'street',
            order: order,
            elemMods: {
                access: adminEdit
            },
            dataset: dataset,
            display: true
        },
        {
            block: 'field',
            elem: 'adds',
            order: order,
            elemMods: {
                access: adminEdit
            },
            dataset: dataset,
            display: true
        },
        { elem: 'separator' },
        {
            block: 'field',
            elem: 'service',
            order: order,
            elemMods: {
                access: adminEdit
            },
            dataset: dataset,
            display: true
        },
        {
            block: 'order',
            elem: 'service-info',
            elemMods: {
                type: order.info.service,
                access: adminEdit
            },
            order: order
        },
        {
            block: 'field',
            elem: 'add-info',
            order: order,
            elemMods: {
                access: adminEdit
            },
            display: !!order.info.add_info
        },
        { elem: 'separator' },
        {
            block: 'field',
            elem: 'income-once',
            order: order,
            elemMods: {
                access: (adminEdit || (user.department._id+'' == order.info.initiator.department._id+'') && order.status == 'client-match')
            },
            display: (order.status == 'client-match' || !!order.info['income-monthly'])
        },
        {
            block: 'field',
            elem: 'income-monthly',
            order: order,
            elemMods: {
                access: (adminEdit || (user.department._id+'' == order.info.initiator.department._id+'') && order.status == 'client-match')
            },
            display: (order.status == 'client-match' || !!order.info['income-monthly'])
        },
        {
            elem: 'actions',
            department: this.ctx.department,
            order: order,
            admin: adminEdit,
            user: this.ctx.user,
            tab: this.ctx.tab
        }
    ]

})
