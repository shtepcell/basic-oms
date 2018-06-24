var db = require('./controllers/connect');

var orders = require('./export'),
    Order = require('./models/Order'),
    Client = require('./models/Client'),
    Provider = require('./models/Provider'),
    Account = require('./models/Account'),
    City = require('./models/City'),
    ClientType = require('./models/ClientType');

var readline = require('readline');

var his = {
    orderCanceled: 'Заказ отклонен',
    orderFinished: 'Заказ выполнен',
    clientNotify: 'Уведомление клиента',
    netConfig: 'Настройка сети',
    clientEquip: 'Установка оборудования у клиента',
    buildSTOP: 'Реализация через СТОП/VSAT',
    buildGZP: 'Построение ГЗП',
    buildGZPPre: 'Построение ГЗП: запрос разрешений/ТУ',
    clientAgreement: 'Согласование с клиентом',
    stopAnalyze: 'Проработка по СТОП/VSAT',
    gzpAnalyze: 'Проработка по ГЗП',
    init: 'Инициация'
};

function clearLine(n = 1) {
    for (var i = 0; i < n; i++) {
        readline.cursorTo(process.stdout, 0);
        readline.clearLine(process.stdout, 1);
    }
}

var count = {
    order: 0,
    client: 0,
    city: 0,
    provider: 0
};

async function find_or_create_TypeClient (name) {
    var type = await ClientType.findOne({name: name});

    if(!type) {
        type = new ClientType({
            name: name,
            shortName: name
        })
        type = await type.save();
    }

    return type
}

async function find_or_create_client (name, type) {
    name = name.trim();
    var client = await Client.findOne({name: name});
    var type = await find_or_create_TypeClient(type);

    if(!client) {
        client = new Client({
            name: name,
            type: type
        })
        client = await client.save();
        count.client++;
        // console.log(`Created client ${client.name}`);
    }

    return client;
}

async function find_or_create_city (name) {
    name = name.trim();
    var city = await City.findOne({name: name});

    if(!city) {
        city = new City({
            name: name,
            type: 'г.'
        })
        city = await city.save();
        count.city++;
        // console.log(`Created city ${city.name}`);
    }

    return city;
}


async function find_or_create_provider(name) {
    if(name) {
        name = name.trim();

        var provider = await Provider.findOne({name: name});

        if(!provider) {
            provider = new Provider({
                name: name,
                type: 'СТОП'
            })

            provider = await provider.save();
            count.provider++;
            // console.log(`Created provider ${provider.name}`);
        }

        return provider;

    } else return undefined;
}

async function find_user (name) {
    if(name) {
        name = name.trim();

        var user = await Account.findOne({login: name});

        return user;

    } else return undefined;
}

function parseOldHistory(hist) {
    var ret = [];

    for (var i = 0; i < hist.length; i++) {
        ret.push({
            date: hist[i].date,
            name: his[hist[i].stage],
            author: hist[i].user
        })
    }

    return ret;
}

(async () => {
    process.stdout.write(`Импорт... 0%\t`);
    process.stdout.write(`Создано заказов: 0\t`);
    process.stdout.write(`Создано клиентов: 0\t`);
    process.stdout.write(`Создано городов: 0\t`);
    process.stdout.write(`Создано провайдеров: 0\t`);


    for (var i = 0; i < orders.length; i++) {
        var client = await find_or_create_client(orders[i].client, orders[i].clientType);
        var city = await find_or_create_city(orders[i].city);
        var provider = await find_or_create_provider(orders[i].stop.provider);
        var initiator = await find_user(orders[i].initiator);
        if(!initiator) console.log(orders[i]);
        var history = parseOldHistory(orders[i].history);

        var order = new Order({
            id: orders[i].id,
            isOld: true,
            deadline: orders[i].deadline,
            status: orders[i].status,
            pause: {
                status: orders[i].pause.status,
                date: orders[i].pause.date
            },
            info: {
                initiator: initiator,
                department: initiator.department,
                'income-once': orders[i].info['income-once'],
                'income-monthly': orders[i].info['income-monthly'],
                add_info: orders[i].info.add_info,
                client: client,
                contact: orders[i].contact,
                service: orders[i].service,
                options: orders[i].serviceParam,
                city: city,
                adds: orders[i].address,
                'date-sign': orders[i].dateSign,
                order: orders[i].order
            },
            gzp: {
                'cost-once': orders[i].gzp['cost-once'],
                'cost-monthly': orders[i].gzp['cost-monthly'],
                time: orders[i].gzp.time,
                need: orders[i].gzp.need,
                capability: orders[i].gzp.capability,
                reason: orders[i].gzp.reason
            },
            stop: {
                'organization-info': orders[i].stop['organization-info'],
                'cost-once': orders[i].stop['cost-once'],
                'cost-monthly': orders[i].stop['cost-monthly'],
                time: orders[i].stop.time,
                provider: provider,
                contact: orders[i].stop.contact,
                capability: orders[i].stop.capability,
                reason: orders[i].stop.reason,
                add_info: orders[i].add_info
            },
            date: orders[i].date,
            history: history
        })
        order.save();
        count.order++;

        clearLine();

        process.stdout.write(`Импорт... ${Math.round((i+1)*100/orders.length)}%\t`);
        process.stdout.write(`Создано заказов: ${count.order}\t`);
        process.stdout.write(`Создано клиентов: ${count.client}\t`);
        process.stdout.write(`Создано городов: ${count.city}\t`);
        process.stdout.write(`Создано провайдеров: ${count.provider}\t`);

    }

    setTimeout(function () {
        process.exit(0);
    }, 2000);

})();
