block('order').elem('actions').elemMod('tab', 'info').content()(function () {
    const ctx = this.ctx;
    const order = ctx.order;
    const user = ctx.user;
    const adminEdit = ctx.adminEdit;

    const isOwner = (order.info.initiator.department._id == user.department._id + '');
    const isGUS = (user.department.name == order.zone);
    const isB2O = (!isOwner && user.department.type == 'b2o' && (order.status == 'all-pre' || order.status == 'stop-pre' || order.status == 'stop-build'));
    const isPre = (order.status == 'all-pre' || order.status == 'gzp-pre' || order.status == 'stop-pre');
    const isMatch = (order.status == 'client-match');
    const isNotify = (order.status == 'client-notify');
    const isNetStatus = (order.status == 'network');
    const isNetUser = (user.department.type == 'net');
    const isAdmin = (user.department.type == 'admin');
    const isPause = (order.pause.status);
    const isRequest = (order.requestPause.status);
    const isRequester = (order.requestPause.user == user._id + '');
    const isReject = (order.status == 'reject');
    const isOn = (order.status == 'succes');
    const isShut = (order.status == 'pre-shutdown');
    const isDemontage = (order.status == 'build-shutdown');
    const isSKS = (order.info.service == 'sks');

    const display = {
        'build-gzp': isOwner && (isPre || isMatch) && (order.gzp.need != undefined || (order.gzp.need && order.gzp.capability) && !isSKS)
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
            display: (isOwner && isMatch && isSKS && order.sks.time != undefined)
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Отправить на проработку по СТОП/VSAT',
                to: 'start-pre-stop',
                id: order.id
            },
            display: (isOwner && isMatch && order.stop.capability == undefined && !isSKS)
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
            display: (isOwner && (isPre || isMatch) && order.stop.capability && !isSKS)
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
                text: 'Направить на отключение',
                to: 'start-pre-shutdown',
                id: order.id
            },
            display: (isOwner || isAdmin) && isOn
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Отключить без демонтажа СРЕ',
                to: 'start-stop-shutdown',
                id: order.id
            },
            display: (isNetUser || isAdmin) && isShut
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Отключить и демонтировать',
                to: 'start-gzp-shutdown',
                id: order.id
            },
            display: (isNetUser || isAdmin) && isShut
        },
        {
            block: 'order',
            elem: 'action',
            data: {
                text: 'Демонтаж выполнен',
                to: 'end-gzp-shutdown',
                id: order.id
            },
            display: (isGUS || isAdmin) && isDemontage
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
