block('order').elem('actions').elemMod('tab', 'stop').content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        user = ctx.user,
        adminEdit = ctx.adminEdit;

    var isOwner = (user.department.type == 'b2o'),
        isPre = (order.status == 'all-pre' || order.status == 'stop-pre'),
        isBuild = (order.status == 'stop-build'),
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
                to: 'end-build-stop',
                id: order.id
            },
            display: (isOwner && isBuild) && !isPause
        }
    ];
})
