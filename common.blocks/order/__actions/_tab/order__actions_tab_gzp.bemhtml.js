block('order').elem('actions').elemMod('tab', 'gzp').content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        user = ctx.user,
        adminEdit = ctx.adminEdit;

    var isOwner = (user.department.type == 'gus' && user.department.cities.indexOf(order.info.city._id) >= 0),
        isPre = (order.status == 'gzp-pre' || order.status == 'all-pre'),
        isBuild = (order.status == 'gzp-build'),
        isInstall = (order.status == 'install-devices'),
        isPause = (order.pause.status);

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
            display: (isOwner && isPre) && !isPause
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Организация завершена',
                to: 'end-build',
                id: order.id
            },
            display: (isOwner && isBuild) && !isPause
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Оборудование установлено',
                to: 'end-install-devices',
                id: order.id
            },
            display: (isOwner && isInstall) && !isPause
        }
    ];
})
