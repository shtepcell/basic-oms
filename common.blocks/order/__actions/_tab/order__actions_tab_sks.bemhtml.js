block('order').elem('actions').elemMod('tab', 'sks').content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        user = ctx.user,
        adminEdit = ctx.adminEdit;

    var isOwner = (user.department.type == 'sks'),
        isPre = (order.status == 'sks-pre'),
        isBuild = (order.status == 'sks-build'),
        isPause = (order.pause.status),
        isAdmin = (user.department.type == 'admin');

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
                to: 'end-sks-build',
                id: order.id
            },
            display: (isOwner && isBuild) && !isPause
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
