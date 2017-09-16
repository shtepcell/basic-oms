const Service = require('../models/Service');
const Client = require('../models/Client');
const City = require('../models/City');

var allFields = {
    'info': [
        {
            index: 'id',
            name: 'Номер заказа',
            val: 'id'
        },
        {
            index: 'date',
            name: 'Дата инициации заказа',
            type: 'date',
            val: ['history']
        },
        {
            index: 'status',
            name: 'Текущий статус',
            type: 'default',
            val: 'status'
        },
        {
            index: 'relation',
            name: 'Связанная заявка',
            type: 'text',
            fill: true,
            val:  ['info', 'relation']
        },
        {
            index: 'initiator-name',
            name: 'Ф.И.О. инициатора',
            val: ['info', 'initiator', 'name']
        },
        {
            index: 'initiator-dep',
            name: 'Подразделение-инициатор',
            val: ['info', 'initiator', 'department', 'name']
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
            fill: true,
            val:  ['info', 'relation']
        },
        {
            index: 'cost-once',
            name: 'Ожидаемый единовр. доход (руб)',
            maxLenght: 50,
            type: 'text',
            fill: true,
            val:  ['info', 'cost-once']
        },
        {
            index: 'cost-monthly',
            name: 'Ожидаемый ежемес. доход (руб)',
            maxLenght: 50,
            type: 'text',
            fill: true,
            val:  ['info', 'cost-monthly']
        },
        {
            index: 'add_info',
            name: 'Дополнительная информация',
            type: 'text',
            fill: true,
            val:  ['info', 'add_info']
        },
        {
            index: 'client',
            name: 'Клиент',
            type: 'suggest',
            data: 'clients',
            fill: true,
            required: true,
            val: function (order) {
                return `[${order.info.client.type.shortName}] ${order.info.client.name}`
            }
        },
        {
            index: 'contact',
            name: 'Контактные данные клиента',
            type: 'text',
            fill: true,
            val:  ['info', 'contact']
        },
        {
            index: 'service',
            name: 'Услуга',
            type: 'select',
            data: 'services',
            fill: true,
            required: true,
            val:  ['info', 'service', 'name']
        },
        {
            index: 'options',
            name: 'Параметры услуги',
            maxLenght: 50,
            type: 'text',
            fill: true,
            val:  ['info', 'options']
        },
        {
            index: 'city',
            name: 'Город',
            type: 'suggest',
            data: 'cities',
            fill: true,
            required: true,
            val:  ['info', 'city', 'name']
        },
        {
            index: 'street',
            name: 'Улица',
            type: 'text',
            fill: true,
            val: ['info', 'street']
        },
        {
            index: 'adds',
            name: 'д./кв. и т.д',
            type: 'text',
            maxLenght: 50,
            fill: true,
            val: ['info', 'adds']
        },
        {
            index: 'ip',
            name: 'Необходимость выделения IP-адресов',
            type: 'bool',
            fill: true,
            default: '0',
            val: function (order) {
                if(order.info.ip) {
                    return 'Да';
                } else return 'Нет';
            }
        },
        {
            index: 'pool',
            name: 'Необходимый пул адресов',
            type: 'text',
            fill: true,
            val: ['info', 'pool']
        },
        {
            index: 'pre',
            name: 'Направить на проработку',
            type: 'stage-select',
            fill: true,
            onlyInit: true,
            data: [
                {
                    text: 'только ГЗП',
                    val: 'gzp-pre'
                },
                {
                    text: 'только STOP/VSAT',
                    val: 'stop-pre'
                },
                {
                    text: 'ГЗП и STOP',
                    val: 'all-pre'
                }
            ]
        }
    ],
    gzp: [
        {
            index: 'date-work',
            name: 'Дата проработки заказа',
            type: 'date'
        },
        {
            index: 'date-work-control',
            name: 'Контрольная дата проработки заказа',
            type: 'date'
        },
        {
            index: 'date-build',
            name: 'Дата организации заказа',
            type: 'date'
        },
        {
            index: 'date-build-control',
            name: 'Контрольная дата организации заказа',
            type: 'date'
        },
        {
            index: 'need',
            name: 'Необходимость в ГЗП',
            type: 'bool',
            fill: true,
            val: function (order) {
                if(order.gzp.need) {
                    return 'Да';
                } else return 'Нет';
            }
        },
        {
            index: 'capability',
            name: 'Техническая возможность',
            type: 'bool',
            fill: true,
            val: function (order) {
                if(order.gzp.capability) {
                    return 'Да';
                } else return 'Нет';
            }
        },
        {
            index: 'time',
            name: 'Срок организации',
            type: 'text',
            fill: true,
            val: ['gzp', 'time']
        },
        {
            index: 'cost-once',
            name: 'Одноразовая стоимость организации',
            type: 'text',
            fill: true,
            val: ['gzp', 'cost-once']
        },
        {
            index: 'cost-monthly',
            name: 'Ежемесячная стоимость организации',
            type: 'text',
            fill: true,
            val: ['gzp', 'cost-monthly']
        }
    ],
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
};

function getVal (order, path) {
    if(Array.isArray(path)) {
        var result = order;
        for (var j = 0; j < path.length; j++) {
            result = result[path[j]];
        }
        return result;
    } else {
        return order[path];
    }
}

function retField(item, data) {
    switch (item.type) {
        case 'suggest':
            return {
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
            }
            break;
        case 'select':
            return {
                name: item.index,
                desc: item.name,
                required: item.required,
                mods: {
                    type: 'select'
                },
                val: '' + data[item.data][0].val,
                data: data[item.data]
            }
            break;
        case 'stage-select':
            return {
                name: item.index,
                desc: item.name,
                required: item.required,
                mods: {
                    type: 'select'
                },
                val: '' + item.data[0].val,
                data: item.data
            }
            break;
        case 'text':
            return {
                name: item.index,
                desc: item.name,
                required: item.required,
                mods: {
                    type: 'text'
                }
            }
            break;
        case 'date':
            return {
                name: item.index,
                desc: item.name,
                required: item.required,
                mods: {
                    type: 'date'
                }
            }
            break;
        case 'bool':
            return {
                name: item.index,
                desc: item.name,
                required: item.required,
                mods: {
                    type: 'select'
                },
                val: item.default || '1',
                data: [
                    {
                        text: 'Да',
                        val: '1'
                    },
                    {
                        text: 'Нет',
                        val: '0'
                    }
                ]
            }
            break;
        default:
            console.log('Нет поля type:', item);
            break;
    }
}

var actions = {
    info: [
        {
            text: 'Отправить на проработку по ГЗП',
            to: 'start-pre-gzp',
            condition: function (user, order) {
                var access = (order.info.initiator.department._id == user.department._id + '');
                if(order.status == 'client-match' && access && !order.gzp) {
                    return true;
                } else return false;
            }
        },
        {
            text: 'Отправить на проработку по STOP/VSAT',
            to: 'start-pre-stop',
            condition: function (user, order) {
                var access = (order.info.initiator.department._id == user.department._id + '');
                if(order.status == 'client-match' && access && !order.stop) {
                    return true;
                } else return false;
            }
        },
        {
            text: 'Отправить на организацию по ГЗП',
            to: 'start-gzp-build',
            condition: function (user, order) {
                var access = (order.info.initiator.department._id == user.department._id + '');
                if(order.status == 'client-match' && access && order.gzp) {
                    return true;
                } else return false;
            }
        },
        {
            text: 'Отправить на организацию по STOP/VSAT',
            to: 'start-stop-build',
            condition: function (user, order) {
                var access = (order.info.initiator.department._id == user.department._id + '');
                if(order.status == 'client-match' && access && order.stop) {
                    return true;
                } else return false;
            }
        },
        {
            text: 'Настройка сети завершена',
            to: 'end-network',
            condition: function (user, order) {
                if(order.status == 'network' && user.department.type == 'net')
                    return true;
                else return false;
            }
        }
    ],
    gzp: [
        {
            text: 'Организация завершена',
            to: 'end-build',
            condition: function (user, order) {
                if( order.status == 'gzp-build' &&
                    user.department.type == 'gus' &&
                    user.department.cities.indexOf(order.info.city._id) >= 0 ) {
                        return true;
                    }
                else return false;
            }
        }
    ]
};

module.exports = {

    getActions: async (order, user, page) => {
        var ret = [];

        actions[page].forEach( item => {
            if( item.condition(user, order) ) {
                ret.push({
                    block: 'order',
                    elem: 'button',
                    js: {
                        data: {
                            to: item.to
                        },
                        url: `/order/${order.id}/action`
                    },
                    text: item.text
                })
            }
        })
        return ret;
    },

    getInfo: async (order) => {
        var info = allFields.info;
        var ret = [];

        info.forEach( item => {
            if(!item.onlyInit)
                if(typeof item.val == 'function') {
                    var val = item.val(order);
                    ret.push({
                        desc: item.name,
                        disabled: true,
                        val: val
                    })
                } else {
                    var val = getVal(order, item.val);
                    ret.push({
                        desc: item.name,
                        disabled: true,
                        val: val
                    })
                }
        });

        return ret;
    },

    getGZP: async (order, access) => {
        var info = allFields.gzp;
        var ret = [];

        console.log( order);
        info.forEach( item => {
            if(access && !order.gzp.complete) {
                if(item.fill)
                    ret.push(retField(item));
                else if(typeof item.val == 'function') {
                    var val = item.val(order);
                    ret.push({
                        desc: item.name,
                        disabled: true,
                        val: val
                    })
                } else {
                    var val = getVal(order, item.val);
                    ret.push({
                        desc: item.name,
                        disabled: true,
                        val: val
                    })
                }
            } else {

                if(!item.onlyInit)
                    if(typeof item.val == 'function') {
                        var val = item.val(order);
                        ret.push({
                            desc: item.name,
                            disabled: true,
                            val: val
                        })
                    } else {
                        var val = getVal(order, item.val);
                        ret.push({
                            desc: item.name,
                            disabled: true,
                            val: val
                        })
                    }
            }
        });

        return ret;
    },

    getInitField: async (isFill) => {
        var services = await Service.find();
        var clients = await Client.find().populate('type');
        var cities = await City.find();

        var data = {};
        data.cities = cities.map( item => `${item.name}` );

        data.services = services.map( item => {
            return {
                text: item.name,
                val: ''+item._id
            }
        });
        data.clients = clients.map( item => `[${item.type.shortName}] ${item.name}` );

        var info = allFields.info;

        var ret = [];

        info.forEach( item => {

            if(item.fill) {
                ret.push(retField(item, data));
            }
        })

        return ret;
    }
}
