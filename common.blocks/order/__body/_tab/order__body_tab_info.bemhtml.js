block('order').elem('body').elemMod('tab', 'info').content()(function () {

    var ctx = this.ctx,
        dataset = ctx.dataset,
        user = ctx.user,
        order = ctx.order,
        adminEdit = ctx.adminEdit;

    var isOwner = (order.info.initiator.department._id == user.department._id + ''),
        isMatch = (order.status == 'client-match'),
        isParticalPre = (order.status == 'gzp-pre' && order.stop.capability == true || ( order.gzp.need != undefined || (order.gzp.need && order.gzp.capability) ) ),
        isNotify = (order.status == 'client-notify'),
        isEnd = (order.status == 'succes' || order.status == 'reject' || isNotify),
        isRelation = (order.info.relation && !isNaN(order.info.relation)),
        // isPre = (order.status == 'all-pre' || order.status == 'gzp-pre' || order.status == 'stop-pre'),
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
            elem: 'clientType',
            order: order,
            elemMods: {
                access: adminEdit || isOwner
            },
            dataset: dataset,
            display: true
        },
        {
            block: 'field',
            elem: 'contact',
            order: order,
            elemMods: {
                access: adminEdit || isOwner
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
        {
            block: 'field',
            elem: 'date-request',
            order: order,
            elemMods: {
                access: adminEdit || isOwner && !isEnd
            },
            display: order.info['date-request'] || isOwner || adminEdit
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
            elem: 'preVolume',
            order: order,
            dataset: dataset,
            display: order.preVolume && ['network', 'gzp-build', 'install-devices', 'stop-build'].includes(order.status)
        },
        {
            block: 'field',
            elem: 'service',
            order: order,
            elemMods: {
                access: adminEdit || isOwner && !isEnd
            },
            dataset: dataset,
            display: true
        },
        {
            block: 'field',
            elem: 'relation',
            order: order,
            display: isRelation
        },
        {
            block: 'order',
            elem: 'service-info',
            elemMods: {
                type: order.info.service,
                access: adminEdit || isOwner && !isEnd
            },
            order: order
        },
        { elem: 'separator' },
        {
            block: 'field',
            elem: 'add-info',
            order: order,
            elemMods: {
                access: adminEdit || isOwner
            },
            display: order.info.add_info || adminEdit || isOwner
        },
        {
            block: 'field',
            elem: 'init-file',
            order: order,
            elemMods: {
                access: adminEdit || isOwner && !order.info['file-init']
            },
            dataset: dataset,
            display: order.info['file-init'] || adminEdit || isOwner
        },
        { elem: 'separator' },
        {
            block: 'field',
            elem: 'idoss',
            order: order,
            elemMods: {
                access: (adminEdit || isOwner && (isMatch || isParticalPre)),
                visible: true
            },
            display: ( ((isMatch || isParticalPre) && isOwner && mustIDOSS) || !!order.info['idoss'] )
        },
        {
            block: 'field',
            elem: 'income-once',
            order: order,
            elemMods: {
                access: (adminEdit || isOwner && (isMatch || isParticalPre))
            },
            display: ( ((isMatch || isParticalPre) && isOwner) || !!order.info['income-monthly'])
        },
        {
            block: 'field',
            elem: 'income-monthly',
            order: order,
            elemMods: {
                access: (adminEdit || isOwner && (isMatch || isParticalPre))
            },
            display: ( ((isMatch || isParticalPre) && isOwner) || !!order.info['income-monthly'])
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
