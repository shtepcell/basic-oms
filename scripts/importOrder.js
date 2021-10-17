const Order = require('../server/models/Order');
const Account = require('../server/models/Account');
const City = require('../server/models/City');
const Provider = require('../server/models/Provider');
const Client = require('../server/models/Client');
const Department = require('../server/models/Department');
const Static = require('../server/models/Static');
const helper = require('../server/controllers/helper');

const data = require('./data.json');

const trim = (item, field) => {
    if (!item[field]) {
        console.log(`Missing field ${field}`);
        console.log(item);
    }

    return item[field].trim();
}

const getCityType = (type) => {
    return {
        'село': 'с.',
        'поселок городского типа': 'пгт.',
        'город': 'г.',
    }[type.toLowerCase()];
}

(async () => {
    const podolo = await Account.findOne({ login: 'podolko' });
    const department = await Department.findOne({ type: 'b2o' });
    const client = await Client.findOne({ name: 'Министерство цифрового развития, связи и массовых коммуникаций Российской Федерации (Проект СЗО)' });

    const ids = [];

    for (const item of data) {
        const nowDate = new Date();

        let city = await City.findOne({ name: trim(item, 'Наименование н.п') });
        const provider = await Provider.findOne({ name: item['Оператор ПМ из СУЗ'].slice(7) })

        if (!city) {
            console.log(`Cannot find city ${trim(item, 'Наименование н.п')}`);

            city = new City({
                type: getCityType(item['Тип населённого пункта']),
                name: trim(item, 'Наименование н.п'),
                usage: true
            });

            city.save();
            console.log(`Created city ${getCityType(item['Тип населённого пункта'])} ${trim(item, 'Наименование н.п')}`)
        }

        if (!provider) {
            console.log(`Cannot find provider ${item['Оператор ПМ из СУЗ'].slice(6)}`);
            continue;
        }

        const order = new Order({
            id: await Static.getOrderId(),
            status: 'stop-build',
            deadline: await helper.calculateDeadline(30),
            info: {
                initiator: podolo,
                department,
                idoss: '*',
                add_info: item['Дополнительная информация'].trim(),
                contact: item['Контактные данные клиента'].trim(),
                service: 'internet',
                clientType : "Крупный бизнес-клиент",
                'income-once': item[' Ожидаемый единовр. доход (руб) '].trim(),
                'income-monthly': item[' Ожидаемый ежемес. доход (руб) '].trim(),
                city: city,
                volume : '10Мб/c',
		        ip : '4 (факт. 1) = /30',
                coordinate: item['Полный адрес по координатам'].trim(),
                client
            },
            stop: {
                'cost-monthly': item[' Операционные затраты ежемесячные '].trim(),
                'cost-once': item[' Единоразовая стоимость организации '].trim(),
                time: 30,
                contact: '_',
                capability: true,
                complete: true,
                provider: provider,
            },
            date: { 
                "init" : nowDate,
                "cs-stop-pre" : nowDate,
                "stop-pre" : nowDate,
                "client-match" : nowDate,
                "cs-stop-organization" : nowDate
            },
            history: [
                {
                    "author" : "Робот СУЗ",
                    "date" : nowDate,
                    "name" : "Инициация заказа"
                },
                {
                    "author" : "Робот СУЗ",
                    "date" : nowDate,
                    "name" : "Проработка СТОП/VSAT",
                },
                {
                    "author" : "Робот СУЗ",
                    "date" : nowDate,
                    "name" : "Согласование с клиентом",
                }
            ]
        });
        

        await order.save().then(() => {
            ids.push(order.id);
            console.log('Order init success')
        });
    }

    console.log(JSON.stringify(ids));
    
    console.log(ids.length);
    console.log(data.length);

    process.exit(0);
})();


