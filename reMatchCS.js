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

    var orders = await Order.find()

    for (var i = 0; i < orders.length; i++) {
        var date = findStageDate(orders[i], 'client-match');

        if(date) {
            orders[i].date['client-match'] = date;
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
