block('order').elem('actions').elemMod('tab', 'info').content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        user = ctx.user,
        adminEdit = ctx.adminEdit;

    var isOwner = (order.info.initiator.department._id == user.department._id + ''),
        isPre = (order.status == 'all-pre' || order.status == 'gzp-pre' || order.status == 'stop-pre'),
        isMatch = (order.status == 'client-match'),
        isNotify = (order.status == 'client-notify'),
        isNetStatus = (order.status == 'network'),
        isNetUser = (user.department.type == 'net'),
        isAdmin = (user.department.type == 'admin'),
        isPause = (order.pause.status),
        isReject = (order.status == 'reject'),
        isOn = (order.status == 'succes'),
        mustIDOSS = (['internet', 'cloud', 'phone', 'wifi', 'iptv'].indexOf(order.info.service) >= 0),
        incomeIsFill = (order.info['income-once'] && order.info['income-monthly']);

        if(mustIDOSS) {
            incomeIsFill = (order.info['income-once'] && order.info['income-monthly'] && order.info.idoss)
        }

    return [
        {
            block: 'order',
            elem: 'action',
            elemMods: {
                type: 'submit'
            },
            data: {
                text: 'Сохранить изменения'
            },
            display: (adminEdit || isOwner && (isPre || isMatch))  && !isPause
        },
        {
            block: 'order',
            elem: 'action',
            elemMods: {
                type: 'submit'
            },
            data: {
                text: 'Заказ выполнен'
            },
            display: (isOwner && isNotify) && !isPause
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Отправить на проработку ГЗП',
                to: 'start-pre-gzp',
                id: order.id
            },
            display: (isOwner && isMatch && !order.gzp.complete) && !isPause
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Отправить на проработку по СТОП/VSAT',
                to: 'start-pre-stop',
                id: order.id
            },
            display: (isOwner && isMatch && !order.stop.complete) && !isPause
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Отправить на организацию по ГЗП',
                to: 'start-gzp-build',
                id: order.id
            },
            display: (isOwner && isMatch && order.gzp.complete) && !isPause && incomeIsFill
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Отправить на организацию по СТОП/VSAT',
                to: 'start-stop-build',
                id: order.id
            },
            display: (isOwner && isMatch && order.stop.complete) && !isPause && incomeIsFill
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Настройка сети завершена',
                to: 'end-network',
                id: order.id
            },
            display: (isNetUser && isNetStatus)
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Отклонить заказ',
                to: 'reject',
                id: order.id
            },
            display: (!isReject && (isOwner || isAdmin)) && !isPause && !isOn
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Полностью удалить заказ',
                to: 'delete',
                id: order.id
            },
            display: isAdmin
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Поcтавить на паузу',
                to: 'pause',
                id: order.id
            },
            display: (!isPause && (isOwner || isAdmin) && !isOn)
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Снять с паузы',
                to: 'stop-pause',
                id: order.id
            },
            display: (isPause && (isOwner || isAdmin) && !isOn)
        }
    ];
})
