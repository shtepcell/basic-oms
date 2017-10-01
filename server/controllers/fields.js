const Service = require('../models/Service');
const Client = require('../models/Client');
const City = require('../models/City');
const Provider = require('../models/Provider');
const common = require('./common');

var stages = {
    'init': 'Инициация заказа',
    'client-match': 'Согласование с клиентом',
    'client-notify': 'Уведомление клиента',
    'all-pre': 'Проработка по ГЗП/STOP',
    'gzp-pre': 'Проработка по ГЗП',
    'gzp-build': 'Организация ГЗП',
    'install-devices': 'Установка оборудования',
    'stop-pre': 'Проработка по STOP/VSAT',
    'stop-build': 'Организация STOP/VSAT',
    'network': 'Настройка сети',
    'succes': 'Завершение обработки',
    'reject': 'Отклонение'
};

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
            val: function (order) {
                return common.dateToStr(order.date.init);
            }
        },
        {
            index: 'status',
            name: 'Текущий статус',
            type: 'default',
            val: function (order) {
                return stages[order.status];
            }
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
            fill: true,
            val: function (order) {
                if(order.info['date-request'])
                    return common.dateToStr(order.info['date-request']);
                else return null;
            }
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
            required: true,
            val:  ['info', 'cost-once']
        },
        {
            index: 'cost-monthly',
            name: 'Ожидаемый ежемес. доход (руб)',
            maxLenght: 50,
            type: 'text',
            fill: true,
            required: true,
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
            val: function (order) {
                return `${order.info.city.type} ${order.info.city.name}`
            }
        },
        {
            index: 'street',
            name: 'Улица',
            type: 'text',
            fill: true,
            required: true,
            val: ['info', 'street']
        },
        {
            index: 'adds',
            name: 'д./кв. и т.д',
            type: 'text',
            maxLenght: 50,
            fill: true,
            required: true,
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
            name: 'Фактическая дата проработки заказа',
            type: 'date',
            val: function (order) {
                if(order.date['gzp-pre'])
                    return common.dateToStr(order.date['gzp-pre']);
                else return null;
            }
        },
        {
            index: 'date-work-control',
            name: 'Контрольная дата проработки заказа',
            type: 'date',
            val: function (order) {

                if(order.status != 'gzp-pre' && order.status != 'all-pre' && !order.date['gzp-pre']) return null;


                if(order.date['client-match']) {
                    var d = new Date(order.date['client-match'].setDate(order.date['client-match'].getDate() + 3));
                    return common.dateToStr(d);
                } else {
                    var d = new Date(order.date['init'].setDate(order.date['init'].getDate() + 3))
                    return common.dateToStr(d);
                }
            }
        },
        {
            index: 'date-build',
            name: 'Фактическая дата организации сервиса',
            type: 'date',
            val: function (order) {
                if(order.date['gzp-build'])
                    return common.dateToStr(order.date['gzp-build']);
                else return null;
            }
        },
        {
            index: 'date-network',
            name: 'Фактическая дата активации сервиса',
            type: 'date',
            val: function (order) {
                if(!order.date['gzp-build']) return null;

                if(order.date['network'])
                    return common.dateToStr(order.date['network']);
                else return null;
            }
        },
        {
            index: 'date-build-control',
            name: 'Контрольная дата активации сервиса',
            type: 'date',
            val: function (order) {
                if(order.date['client-match'] && order.date['gzp-pre']) {
                    var d = new Date(order.date['client-match'].setDate(order.date['client-match'].getDate() + order.gzp.time));
                    return common.dateToStr(d);
                }
            }
        },
        {
            index: 'need',
            name: 'Необходимость в ГЗП',
            type: 'bool',
            required: true,
            fill: true,
            val: function (order) {
                if(order.gzp.complete)
                    if(order.gzp.need) {
                        return 'Да';
                    } else return 'Нет';
                else return null;
            }
        },
        {
            index: 'capability',
            name: 'Техническая возможность',
            type: 'bool',
            required: true,
            fill: true,
            val: function (order) {
                if(order.gzp.complete)
                    if(order.gzp.capability) {
                        return 'Да';
                    } else return 'Нет';
                else return null;
            }
        },
        {
            index: 'time',
            name: 'Срок организации',
            type: 'text',
            required: true,
            fill: true,
            val: ['gzp', 'time']
        },
        {
            index: 'cost-once',
            name: 'Одноразовая стоимость организации',
            type: 'text',
            required: true,
            fill: true,
            val: ['gzp', 'cost-once']
        },
        {
            index: 'cost-monthly',
            name: 'Операционные затраты ежемесячные',
            type: 'text',
            required: true,
            fill: true,
            val: ['gzp', 'cost-monthly']
        },
        {
            index: 'add_info',
            name: 'Дополнительная информация',
            type: 'text',
            fill: true,
            val: ['gzp', 'add_info']
        }
    ],
    stop: [
        {
            index: 'date-work',
            name: 'Фактическая дата проработки заказа',
            type: 'date',
            val: function (order) {
                if(order.date['stop-pre'])
                    return common.dateToStr(order.date['stop-pre']);
                else return null;
            }
        },
        {
            index: 'date-work-control',
            name: 'Контрольная дата проработки заказа',
            type: 'date',
            val: function (order) {

                if(order.status != 'stop-pre' && order.status != 'all-pre' && !order.date['stop-pre']) return null;

                if(order.date['client-match']) {
                    var d = new Date(order.date['client-match'].setDate(order.date['client-match'].getDate() + 3));
                    return common.dateToStr(d);
                } else {
                    var d = new Date(order.date['init'].setDate(order.date['init'].getDate() + 3))
                    return common.dateToStr(d);
                }
            }
        },
        {
            index: 'date-build',
            name: 'Фактическая дата организации сервиса',
            type: 'date',
            val: function (order) {
                if(order.date['stop-build'])
                    return common.dateToStr(order.date['stop-build']);
                else return null;
            }
        },
        {
            index: 'date-network',
            name: 'Фактическая дата активации сервиса',
            type: 'date',
            val: function (order) {

                if(!order.date['stop-build']) return null;

                if(order.date['network'])
                    return common.dateToStr(order.date['network']);
                else return null;
            }
        },
        {
            index: 'date-build-control',
            name: 'Контрольная дата активации сервиса',
            type: 'date',
            val: function (order) {
                if(order.date['client-match'] && order.date['stop-pre']) {
                    var d = new Date(order.date['client-match'].setDate(order.date['client-match'].getDate() + order.stop.time));
                    return common.dateToStr(d);
                }
            }
        },
        {
            index: 'capability',
            name: 'Техническая возможность',
            type: 'bool',
            fill: true,
            required: true,
            val: function (order) {
                if(order.stop.complete)
                    if(order.stop.capability) {
                        return 'Да';
                    } else return 'Нет';
                else return null;
            }
        },
        {
            index: 'provider',
            name: 'Провайдер',
            type: 'suggest',
            data: 'providers',
            fill: true,
            required: true,
            val: function (order) {
                if(order.stop.complete)
                    return `[${order.stop.provider.type}] ${order.stop.provider.name}`
                else return null;
            }
        },
        {
            index: 'contact',
            name: 'Контакт с провайдером',
            type: 'text',
            required: true,
            maxLenght: 50,
            fill: true,
            val: ['stop', 'contact']
        },
        {
            index: 'devices',
            name: 'Оборудование',
            type: 'text',
            maxLenght: 50,
            fill: true,
            val: ['stop', 'devices']
        },
        {
            index: 'add_devices',
            name: 'Дополнительное оборудование',
            type: 'text',
            maxLenght: 50,
            fill: true,
            val: ['stop', 'add_devices']
        },
        {
            index: 'interfaces',
            name: 'Интерфейсы',
            type: 'text',
            maxLenght: 50,
            fill: true,
            val: ['stop', 'interfaces']
        },
        {
            index: 'time',
            name: 'Срок организации',
            type: 'text',
            required: true,
            maxLenght: 50,
            fill: true,
            val: ['stop', 'time']
        },
        {
            index: 'add_info',
            name: 'Дополнительная информация',
            type: 'text',
            maxLenght: 50,
            fill: true,
            val: ['stop', 'add_info']
        },
        {
            index: 'organization_info',
            name: 'Информация об организации',
            type: 'text',
            maxLenght: 50,
            fill: true,
            val: ['stop', 'organization_info']
        },
        {
            index: 'cost-once',
            name: 'Одноразовая стоимость организации',
            required: true,
            type: 'text',
            fill: true,
            val: ['stop', 'cost-once']
        },
        {
            index: 'cost-monthly',
            name: 'Ежемесячная стоимость организации',
            required: true,
            type: 'text',
            fill: true,
            val: ['stop', 'cost-monthly']
        }
    ]
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
        if(result == '') result == null;
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
                if(order.status == 'client-match' && access && !order.gzp.complete) {
                    return true;
                } else return false;
            }
        },
        {
            text: 'Отправить на проработку по STOP/VSAT',
            to: 'start-pre-stop',
            condition: function (user, order) {
                var access = (order.info.initiator.department._id == user.department._id + '');
                if(order.status == 'client-match' && access && !order.stop.complete) {
                    return true;
                } else return false;
            }
        },
        {
            text: 'Отправить на организацию по ГЗП',
            to: 'start-gzp-build',
            condition: function (user, order) {
                var access = (order.info.initiator.department._id == user.department._id + '');
                if(order.status == 'client-match' && access && order.gzp.complete) {
                    return true;
                } else return false;
            }
        },
        {
            text: 'Отправить на организацию по STOP/VSAT',
            to: 'start-stop-build',
            condition: function (user, order) {
                var access = (order.info.initiator.department._id == user.department._id + '');
                if(order.status == 'client-match' && access && order.stop.complete) {
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
        },
        {
            text: 'Оборудование установлено',
            to: 'end-install-devices',
            condition: function (user, order) {
                if(order.status == 'install-devices' && user.department.type == 'gus' &&
                    user.department.cities.indexOf(order.info.city._id) >= 0 )
                    return true;
                else return false;
            }
        }
    ],
    stop: [
        {
            text: 'Организация завершена',
            to: 'end-build-stop',
            condition: function (user, order) {
                if( order.status == 'stop-build' &&
                    user.department.type == 'b2o') {
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

        info.forEach( item => {
            if(!!access && (order.status == 'all-pre' || order.status == 'gzp-pre')) {
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

    getSTOP: async (order, access) => {
        var stop = allFields.stop;
        var ret = [];
        var prvdrs = await Provider.find();
        var data = {};
        data.providers = prvdrs.map( item => {
            return `[${item.type}] ${item.name}`
        });
        stop.forEach( item => {
            if(!!access && (order.status == 'stop-pre' || order.status == 'all-pre') ) {
                if(item.fill)
                    ret.push(retField(item, data));
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
        data.cities = cities.map( item => `${item.type} ${item.name}` );

        data.services = services.map( item => {
            return {
                text: item.name,
                val: ''+item._id
            }
        });
        data.clients = clients.map( item => `${item.name}` );

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
