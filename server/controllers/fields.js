const Service = require('../models/Service');
const Client = require('../models/Client');
const City = require('../models/City');

var allFields = {
    init: [
        {
            index: 'id',
            name: 'Номер заказа',
            value: 'id'
        },
        {
            index: 'date',
            name: 'Дата инициации заказа',
            type: 'date'
        },
        {
            index: 'status',
            name: 'Текущий статус',
            type: 'default',
            value: 'status'
        },
        {
            index: 'relation',
            name: 'Связанная заявка',
            type: 'text',
            fill: true,
            value: 'relation'
        },
        {
            index: 'initiator-name',
            name: 'Ф.И.О. инициатора',
            type: 'default'
        },
        {
            index: 'initiator-dep',
            name: 'Подразделение-инициатор',
            type: 'default'
        },
        {
            index: 'date-request',
            name: 'Требуемая дата организации',
            type: 'date',
            fill: true
        },
        {
            index: 'cms',
            name: 'Номер сервиса в CMS',
            maxLenght: 50,
            type: 'text',
            fill: true
        },
        {
            index: 'cost-once',
            name: 'Ожидаемый единовр. доход (руб)',
            maxLenght: 50,
            type: 'text',
            fill: true
        },
        {
            index: 'cost-monthly',
            name: 'Ожидаемый ежемес. доход (руб)',
            maxLenght: 50,
            type: 'text',
            fill: true
        },
        {
            index: 'add_info',
            name: 'Дополнительная информация',
            type: 'text',
            fill: true
        },
        {
            index: 'client',
            name: 'Клиент',
            type: 'suggest',
            data: 'clients',
            fill: true,
            required: true
        },
        {
            index: 'contact',
            name: 'Контактные данные клиента',
            type: 'text',
            fill: true
        },
        {
            index: 'service',
            name: 'Услуга',
            type: 'select',
            data: 'services',
            fill: true,
            required: true
        },
        {
            index: 'options',
            name: 'Параметры услуги',
            maxLenght: 50,
            type: 'text',
            fill: true
        },
        {
            index: 'city',
            name: 'Город',
            type: 'suggest',
            data: 'cities',
            fill: true,
            required: true
        },
        {
            index: 'street',
            name: 'Улица',
            type: 'text',
            fill: true
        },
        {
            index: 'adds',
            name: 'д./кв. и т.д',
            type: 'text',
            maxLenght: 50,
            fill: true
        },
        {
            index: 'ip',
            name: 'Необходимость выделения IP-адресов',
            type: 'bool',
            fill: true
        },
        {
            index: 'pool',
            name: 'Необходимый пул адресов',
            type: 'text',
            fill: true
        }
    ]
    // gzp: {
    //     'date-work': {
    //         name: 'Дата проработки заказа',
    //         type: 'date'
    //     },
    //     'date-work-control': {
    //         name: 'Контрольная дата проработки заказа',
    //         type: 'date'
    //     },
    //     'date-build': {
    //         name: 'Дата организации заказа',
    //         type: 'date'
    //     },
    //     'date-build-control': {
    //         name: 'Контрольная дата организации заказа',
    //         type: 'date'
    //     },
    //     need: {
    //         name: 'Необходимость в ГЗП',
    //         type: 'Boolean',
    //         fill: true
    //     },
    //     capability: {
    //         name: 'Техническая возможность',
    //         type: 'Boolean',
    //         fill: true
    //     },
    //     time: {
    //         name: 'Срок организации',
    //         date: 'date',
    //         fill: true
    //     },
    //     cost: {
    //         once: {
    //             name: 'Одноразовая стоимость организации',
    //             type: 'Number',
    //             fill: true
    //         },
    //         monthly: {
    //             name: 'Ежемесячная стоимость организации',
    //             type: 'Number',
    //             fill: true
    //         }
    //     }
    // },
    // stop: {
    //     capability: {
    //         name: 'Техническая возможность',
    //         type: 'Boolean',
    //         fill: true
    //     },
    //     provider: {
    //         name: 'Провайдер',
    //         type: 'Provider',
    //         fill: true
    //     },
    //     contact: {
    //         name: 'Контакт с провайдером',
    //         type: 'text',
    //         maxLenght: 50,
    //         fill: true
    //     },
    //     devices: {
    //         name: 'Оборудование',
    //         type: 'text',
    //         maxLenght: 50,
    //         fill: true
    //     },
    //     add_devices: {
    //         name: 'Дополнительное оборудование',
    //         type: 'text',
    //         maxLenght: 50,
    //         fill: true
    //     },
    //     interfaces: {
    //         name: 'Интерфейсы',
    //         type: 'text',
    //         maxLenght: 50,
    //         fill: true
    //     },
    //     time: {
    //         name: 'Срок организации',
    //         type: 'text',
    //         maxLenght: 50,
    //         fill: true
    //     },
    //     add_info: {
    //         name: 'Дополнительная информация',
    //         type: 'text',
    //         maxLenght: 50,
    //         fill: true
    //     },
    //     organization_info: {
    //         name: 'Информация об организации',
    //         type: 'text',
    //         maxLenght: 50,
    //         fill: true
    //     },
    //     cost: {
    //         once: {
    //             name: 'Одноразовая стоимость организации',
    //             type: 'Number',
    //             fill: true
    //         },
    //         monthly: {
    //             name: 'Ежемесячная стоимость организации',
    //             type: 'Number',
    //             fill: true
    //         }
    //     }
    // },
        // close: {
        //     file: {
        //         name: 'Договор',
        //         type: 'File',
        //         fill: true
        //     },
        //     date: {
        //         name: 'Дата подписания договора',
        //         type: 'date',
        //         fill: true
        //     }
        // }
}

module.exports = {
    getInitField: async (isFill) => {
        var services = await Service.find();
        var clients = await Client.find().populate('type');
        var cities = await City.find();

        var data = {};
        data.cities = cities.map( item => `${item.name}` );

        data.services = services.map( item => {
            return {
                text: item.name,
                val: item._id
            }
        });
        data.clients = clients.map( item => ` [${item.type.shortName}] ${item.name}` );

        var init = allFields.init;

        var ret = [];

        init.forEach( item => {

            if(item.fill) {
                switch (item.type) {
                    case 'suggest':
                        ret.push({
                            name: item.index,
                            desc: item.name,
                            required: item.required,
                            mods: {
                                type: 'suggest',
                                'has-dataprovider' : 'adress'
                            },
                            dataprovider : {
                                data : data[item.data]
                            }
                        })
                        break;
                    case 'select':
                        ret.push({
                            name: item.index,
                            desc: item.name,
                            required: item.required,
                            mods: {
                                type: 'select'
                            },
                            data: data[item.data]
                        })
                        break;
                    case 'text':
                        ret.push({
                            name: item.index,
                            desc: item.name,
                            required: item.required,
                            mods: {
                                type: 'text'
                            }
                        })
                        break;
                    case 'date':
                        ret.push({
                            name: item.index,
                            desc: item.name,
                            required: item.required,
                            mods: {
                                type: 'date'
                            }
                        })
                        break;
                    case 'bool':
                        ret.push({
                            name: item.index,
                            desc: item.name,
                            required: item.required,
                            mods: {
                                type: 'select'
                            },
                            data: [
                                {
                                    text: 'Да',
                                    val: true
                                },
                                {
                                    text: 'Нет',
                                    val: false
                                }
                            ]
                        })
                        break;
                    default:
                        console.log('Нет поля type:', item);
                        break;
                }
            }
        })

        return ret;
    }
}
