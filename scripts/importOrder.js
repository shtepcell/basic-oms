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

const getService = (service) => ({
    'l2vpn': 'l2vpn' 
}[service.toLowerCase()]);

(async () => {
    const initiator = await Account.findOne({ login: 'erokhin' });
    const department = await Department.findOne({ type: 'b2o' });
    const client = await Client.findOne({ name: 'Министерство цифрового развития, связи и массовых коммуникаций Российской Федерации (Проект ЕСПД)' });

    const ids = [];
    
    for (const item of data) {
        const nowDate = new Date();

        let city = await City.findOne({ name: trim(item, 'Наименование н.п') });
        // const provider = await Provider.findOne({ name: item['Оператор ПМ из СУЗ'].slice(7) })

        if (!city) {
            console.log(`Cannot find city ${trim(item, 'Наименование н.п')}`);

            city = new City({
                type: getCityType(item['Тип населённого пункта'] || item['Тип населенного пункта']),
                name: trim(item, 'Наименование н.п'),
                usage: true
            });

            city.save();
            console.log(`Created city ${getCityType(item['Тип населённого пункта'] || item['Тип населенного пункта'])} ${trim(item, 'Наименование н.п')}`)
        }

        // if (!provider) {
        //     console.log(`Cannot find provider ${item['Оператор ПМ из СУЗ'].slice(6)}`);
        //     continue;
        // }

        const order = new Order({
            id: await Static.getOrderId(),
            status: 'gzp-build',
            deadline: await helper.calculateDeadline(Number(item[' Контрольный срок '])),
            info: {
                initiator: initiator,
                department,
                idoss: item[' ID OSS* '] || '*',
                add_info: item['Дополнительная информация'].trim(),
                contact: item['Контактные данные клиента'].trim(),
                service: getService(item['Услуга']),
                clientType : "Крупный бизнес-клиент",
                'income-once': item[' Ожидаемый единовр. доход (руб) '].trim(),
                'income-monthly': item[' Ожидаемый ежемес. доход (руб) '].trim(),
                city: city,
                volume : item['Емкость Мб/с'],
		        ip : '4 (факт. 1) = /30',
                coordinate: item['Полный адрес по координатам'].trim(),
                client,
                cms: item['CMS'],
            },
            gzp: {
                'cost-monthly': item[' Операционные затраты ежемесячные '].trim(),
                'cost-once': item[' Единоразовая стоимость организации '].trim(),
                time: Number(item[' Контрольный срок ']),
                capability: true,
                complete: true,
                need: true,
            },
            date: { 
                "init" : nowDate,
                "cs-gzp-pre" : nowDate,
                "gzp-pre" : nowDate,
                "client-match" : nowDate,
                "cs-gzp-organization" : nowDate
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
                    "name" : "Проработка ГЗП",
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


