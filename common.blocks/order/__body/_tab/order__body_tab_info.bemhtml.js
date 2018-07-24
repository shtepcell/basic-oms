block('order').elem('body').elemMod('tab', 'info').content()(function () {

    var ctx = this.ctx,
        tab = ctx.tab,
        dataset = ctx.dataset,
        user = ctx.user,
        order = ctx.order,
        adminEdit = ctx.adminEdit;

    var isOwner = (user.department._id+'' == order.info.initiator.department._id+''),
        isMatch = (order.status == 'client-match'),
        isNotify = (order.status == 'client-notify'),
        isPre = (order.status == 'all-pre' || order.status == 'gzp-pre' || order.status == 'stop-pre'),
        mustIDOSS = (['internet', 'cloud', 'phone', 'wifi', 'iptv'].indexOf(order.info.service) >= 0);

    return [
        {
            block: 'field',
            elem: 'initiator',
            order: order,
            dataset: dataset,
            display: true
        },
        {
            block: 'field',
            elem: 'date-init',
            order: order,
            elemMods: {
                access: false
            },
            dataset: dataset,
            display: true
        },
        {
            block: 'field',
            elem: 'in-pause',
            order: order,
            elemMods: {
                access: false
            },
            dataset: dataset,
            display: order.pause.status
        },
        { elem: 'separator' },
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
        {
            block: 'field',
            elem: 'cms',
            order: order,
            elemMods: {
                access: adminEdit
            },
            display: order.info.cms
        },
        { elem: 'separator' },
        {
            block: 'field',
            elem: 'zone',
            order: order,
            elemMods: {
                access: false
            },
            dataset: dataset,
            display: true
        },
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
            elem: 'adress-info',
            elemMods: {
                type: (order.info.coordinate)?'coordination':'location',
                access: adminEdit
            },
            dataset: dataset,
            order: order
        },
        { elem: 'separator' },
        {
            block: 'field',
            elem: 'service',
            order: order,
            elemMods: {
                access: adminEdit || (isOwner && isPre)
            },
            dataset: dataset,
            display: true
        },
        {
            block: 'order',
            elem: 'service-info',
            elemMods: {
                type: order.info.service,
                access: adminEdit || (isOwner && isPre)
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
                access: adminEdit || isOwner && !order.info['file-init']
            },
            dataset: dataset,
            display: true
        },
        { elem: 'separator' },
        {
            block: 'field',
            elem: 'idoss',
            order: order,
            elemMods: {
                access: (adminEdit || isOwner && isMatch)
            },
            display: ( (isMatch && isOwner && mustIDOSS) || !!order.info['idoss'] )
        },
        {
            block: 'field',
            elem: 'income-once',
            order: order,
            elemMods: {
                access: (adminEdit || isOwner && isMatch)
            },
            display: ( (isMatch && isOwner) || !!order.info['income-monthly'])
        },
        {
            block: 'field',
            elem: 'income-monthly',
            order: order,
            elemMods: {
                access: (adminEdit || isOwner && isMatch)
            },
            display: ( (isMatch && isOwner) || !!order.info['income-monthly'])
        },
        {
            block: 'field',
            elem: 'order',
            order: order,
            elemMods: {
                access: (adminEdit || isOwner && isNotify)
            },
            display: ( (isNotify && isOwner) || order.info.order)
        },
        {
            block: 'field',
            elem: 'date-sign',
            order: order,
            elemMods: {
                access: (adminEdit || isOwner && isNotify)
            },
            display: ( (isNotify && isOwner) || order.info['date-sign'])
        },
        {
            elem: 'actions',
            elemMods: {
                tab: 'info'
            },
            dataset: dataset,
            order: order,
            adminEdit: adminEdit,
            user: this.ctx.user
        }
    ]

})
