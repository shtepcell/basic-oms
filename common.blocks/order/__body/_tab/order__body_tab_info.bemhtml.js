block('order').elem('body').elemMod('tab', 'info').content()(function () {

    var ctx = this.ctx,
        tab = ctx.tab,
        dataset = ctx.dataset,
        user = ctx.user,
        order = ctx.order,
        adminEdit = ctx.adminEdit;

    var isOwner = (user.department._id+'' == order.info.initiator.department._id+'');
    
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
        {
            block: 'field',
            elem: 'init-file',
            order: order,
            elemMods: {
                access: adminEdit
            },
            dataset: dataset,
            display: order.info['file-init']
        },
        { elem: 'separator' },
        {
            block: 'field',
            elem: 'income-once',
            order: order,
            elemMods: {
                access: (adminEdit || (user.department._id+'' == order.info.initiator.department._id+'') && order.status == 'client-match')
            },
            display: ( (order.status == 'client-match' && isOwner) || !!order.info['income-monthly'])
        },
        {
            block: 'field',
            elem: 'income-monthly',
            order: order,
            elemMods: {
                access: (adminEdit || (user.department._id+'' == order.info.initiator.department._id+'') && order.status == 'client-match')
            },
            display: ( (order.status == 'client-match' && isOwner) || !!order.info['income-monthly'])
        },
        {
            block: 'field',
            elem: 'order',
            order: order,
            elemMods: {
                access: (adminEdit || (user.department._id+'' == order.info.initiator.department._id+'') && order.status == 'client-notify')
            },
            display: ( (order.status == 'client-notify' && isOwner) || order.info.order)
        },
        {
            block: 'field',
            elem: 'date-sign',
            order: order,
            elemMods: {
                access: (adminEdit || isOwner && order.status == 'client-notify')
            },
            display: ( (order.status == 'client-notify' && isOwner) || order.info['date-sign'])
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
