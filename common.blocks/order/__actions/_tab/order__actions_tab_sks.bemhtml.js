block('order').elem('actions').elemMod('tab', 'sks').content()(function () {
    const { order, user, adminEdit } = this.ctx;
    const { status, info: { service } } = order;

    const isNetService = ['wifi', 'wifiorg', 'sputnik'].includes(service);
    const isBuild = status === 'sks-build';

    const isOwner = (status === 'sks-pre' || isBuild) && user.department.type === 'net' || isNetService && user.department.type === 'net';
    const isPre = ['sks-pre', 'pre'].includes(status);
    const isAdmin = user.department.type === 'admin';

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
            display: (isOwner && isPre)
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Организация завершена',
                to: 'end-sks-build',
                id: order.id
            },
            display: (isOwner && isBuild)
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
