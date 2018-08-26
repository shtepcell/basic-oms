block('order').elem('actions').elemMod('tab', 'info').content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        user = ctx.user,
        adminEdit = ctx.adminEdit;

    var isOwner = (order.info.initiator.department._id == user.department._id + ''),
        isGUS = (user.department.name == order.zone),
        isB2O = (!isOwner && user.department.type == 'b2o' && (order.status == 'all-pre' || order.status == 'stop-pre' || order.status == 'stop-build')),
        isPre = (order.status == 'all-pre' || order.status == 'gzp-pre' || order.status == 'stop-pre'),
        isMatch = (order.status == 'client-match'),
        isNotify = (order.status == 'client-notify'),
        isNetStatus = (order.status == 'network'),
        isNetUser = (user.department.type == 'net'),
        isAdmin = (user.department.type == 'admin'),
        isPause = (order.pause.status),
        isRequest = (order.requestPause.status),
        isRequester = (order.requestPause.user == user._id + ''),
        isReject = (order.status == 'reject'),
        isOn = (order.status == 'succes'),
        mustIDOSS = (['internet', 'cloud', 'phone', 'wifi', 'iptv'].indexOf(order.info.service) >= 0),
        incomeIsFill = (order.info['income-once'] && order.info['income-monthly']),
        isSKS = (order.info.service == 'sks');

        if(mustIDOSS) {
            incomeIsFill = (order.info['income-once'] && order.info['income-monthly'] && order.info.idoss)
        }

        var display = {
            'build-gzp': isOwner && isMatch && ( order.gzp.need != undefined || ( order.gzp.need  && order.gzp.capability ) && !isSKS) && incomeIsFill
        };

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
            display: isOwner || adminEdit
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
            display: (isOwner && isNotify)
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Отправить на проработку ГЗП',
                to: 'start-pre-gzp',
                id: order.id
            },
            display: (isOwner && isMatch && order.gzp.need == undefined && !isSKS)
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Отправить на проработку СКС',
                to: 'start-sks-pre',
                id: order.id
            },
            display: (isOwner && isMatch && isSKS && order.sks.time == undefined)
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Отправить на реализацию СКС',
                to: 'start-sks-build',
                id: order.id
            },
            display: (isOwner && isMatch && isSKS && order.sks.time != undefined) && incomeIsFill
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Отправить на проработку по СТОП/VSAT',
                to: 'start-pre-stop',
                id: order.id
            },
            display: (isOwner && isMatch &&  order.stop.capability == undefined && !isSKS)
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Отправить на организацию по ГЗП',
                to: 'start-gzp-build',
                id: order.id
            },
            display: display['build-gzp']
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Отправить на организацию по СТОП/VSAT',
                to: 'start-stop-build',
                id: order.id
            },
            display: (isOwner && isMatch && order.stop.capability && !isSKS) && incomeIsFill
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Вернуть обратно в организацию',
                to: 'comeback',
                id: order.id
            },
            display: (isNetUser && isNetStatus)
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
            display: (!isReject && (isOwner || isAdmin)) && !isOn
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
            data: {
                text: 'Запросить паузу',
                to: 'request-pause',
                id: order.id
            },
            display: (!isPause && !isRequest && (isB2O || isGUS || (isNetStatus && isNetUser)) && !isOn)
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Отклонить запрос паузы',
                to: 'reject-pause',
                id: order.id
            },
            display: (isRequest && (isOwner || isRequester) && !isOn)
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Поставить на паузу',
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
        },
        {
            block: 'order',
            elem: 'action',
            elemMods: {
                type: 'redirect'
            },
            deps: ctx.dataset.deps,
            id: order.id,
            display: isAdmin || isOwner || isGUS
        }
    ];
})
