block('order').elem('actions').elemMod('tab', 'gzp').content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        user = ctx.user,
        adminEdit = ctx.adminEdit;

    var isOwner = order.resp.includes(user.department.name),
        isPre = (order.status == 'gzp-pre' || order.status == 'all-pre'),
        isBuild = (order.status == 'gzp-build'),
        isInstall = (order.status == 'install-devices'),
        isAdmin = (user.department.type == 'admin'),
        isDemontage = (order.status == 'build-shutdown'),
        special = (user.department._id == '' + order.special);

    return [
        {
            block: 'order',
            elem: 'action',
            elemMods: {
                type: 'submit'
            },
            data: {
                text: 'Проработка завершена'
            },
            display: ((isOwner || special) && isPre)
        },
        {
            block: 'order',
            elem: 'action',
            elemMods: {
                type: 'submit'
            },
            data: {
                text: 'Организация завершена'
            },
            display: ((isOwner || special) && isBuild)
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Демонтаж выполнен',
                to: 'end-gzp-shutdown',
                id: order.id
            },
            display: (isOwner || isAdmin) && isDemontage
        },
        {
            block: 'order',
            elem: 'action',
            elemMods: {
                type: 'submit'
            },
            data: {
                text: 'Оборудование установлено'
            },
            display: ((isOwner || special) && isInstall)
        },
        {
            block: 'order',
            elem: 'action',
            elemMods: {
                type: 'add-param'
            },
            data: {
                text: 'Административная правка'
            },
            display: !adminEdit && isAdmin
        },
        {
            block: 'order',
            elem: 'action',
            elemMods: {
                type: 'submit'
            },
            data: {
                text: 'Сохранить изменения'
            },
            display: adminEdit && isAdmin
        }
    ];
})
