const Order = require('./server/models/Order'),
    Holiday = require('./server/models/Holiday');


var his = {
    'client-notify': 'Уведомление клиента',
    'network': 'Настройка сети',
    'install-devices': 'Установка оборудования у клиента',
    'stop-build': 'Реализация через СТОП/VSAT',
    'gzp-build': 'Построение ГЗП',
    'client-match': 'Согласование с клиентом',
    'stop-pre': 'Проработка по СТОП/VSAT',
    'gzp-pre': 'Проработка по ГЗП',
    'init': 'Инициация'
};

(async () => {

    var orders = await Order.find({
        status: {$ne: 'secret'},
        status: {$ne: 'reject'},
        status: {$ne: 'succes'}
    })

    for (var i = 0; i < orders.length; i++) {
        switch (orders[i].status) {
            case 'stop-pre':
                var date = findStageDate(orders[i], 'client-match') || findStageDate(orders[i], 'init');

                var dl = calculateDeadline(3, date);
                orders[i].deadline = dl
                orders[i].date['cs-stop-pre'] = dl;
                break;
            case 'gzp-pre':
                var date = findStageDate(orders[i], 'client-match') || findStageDate(orders[i], 'init');

                var dl = calculateDeadline(3, date);
                orders[i].deadline = dl
                orders[i].date['cs-gzp-pre'] = dl;
                break;
            case 'sks-pre':
                var date = findStageDate(orders[i], 'client-match') || findStageDate(orders[i], 'init');

                var dl = calculateDeadline(3, date);
                orders[i].deadline = dl
                orders[i].date['cs-sks-pre'] = dl;
                break;
            case 'gzp-build':
                var date = findStageDate(orders[i], 'client-match');

                var dl = calculateDeadline(orders[i].gzp.time, date);
                orders[i].deadline = dl
                orders[i].date['cs-gzp-organization'] = dl;
                break;
            case 'install-devices':
                var date = findStageDate(orders[i], 'client-match');

                var dl = calculateDeadline(orders[i].gzp.time, date);
                orders[i].deadline = dl
                orders[i].date['cs-gzp-organization'] = dl;
                break;
            case 'stop-build':
                var date = findStageDate(orders[i], 'client-match');

                var dl = calculateDeadline(orders[i].stop.time, date);
                orders[i].deadline = dl
                orders[i].date['cs-stop-organization'] = dl;
                break;
            case 'sks-build':
                var date = findStageDate(orders[i], 'client-match');
                if(orders[i].isOld)
                    var dl = calculateDeadline(orders[i].gzp.time, date);
                else
                    var dl = calculateDeadline(orders[i].sks.time, date);

                orders[i].deadline = dl
                orders[i].date['cs-sks-organization'] = dl;
                break;
            case 'client-match':
                var dates = [
                    findStageDate(orders[i], 'gzp-pre'),
                    findStageDate(orders[i], 'stop-pre'),
                    findStageDate(orders[i], 'sks-pre')
                ];

                dates = dates.sort();

                var date = dates[0];

                if(date) {

                    var dl = calculateDeadline(10, date);
                    orders[i].deadline = dl
                    orders[i].date['cs-client-match'] = dl;
                }

                break;
            case 'client-notify':
                var date = findStageDate(orders[i], 'network');

                var dl = calculateDeadline(10, date);
                orders[i].deadline = dl
                orders[i].date['cs-client-notify'] = dl;
                break;
        }
        var done = await orders[i].save();
    }

    process.exit(0);
})();

function findStageDate (order, stage)  {
    var history = order.history,
        res;

    for (var i = 0; i < history.length; i++) {
        if(his[stage] == history[i].name && history[i].author) res = history[i].date;
    }

    return res;
}

function calculateDeadline (time, from) {
    if(!time) console.log('warning');
    var now = from;

    var i = 0;

    while (time > 0) {
        var day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);

        if(day.getDay() != 6 && day.getDay() != 0) {
            time--;
        }
        i++;
    }
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, 0, 0, 0, 0);
}
