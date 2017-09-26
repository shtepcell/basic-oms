block('order').elem('body').content()(function () {
    var order = this.ctx.order,
        tab = this.ctx.tab,
        user = this.ctx.user,
        adminEdit = this.ctx.admin,
        dataset = this.ctx.dataset;

    var fields;
    switch (tab) {
        case 'info':
            fields = [
                {
                    name: 'Дата инициации заказа',
                    val: dateToStr(order.date.init),
                },
                {
                    name: 'Связанные заявки',
                    field: {
                        name: 'relation',
                        type: 'text',
                        placeholder: '#1234 #4321'
                    },
                    val:  order.info.relation,
                    access: (adminEdit)
                },
                {
                    name: 'Ф.И.О. инициатора',
                    val: order.info.initiator.name
                },
                {
                    name: 'Подразделение-инициатор',
                    val: order.info.initiator.department.name
                },
                {
                    name: 'Требуемая дата организации',
                    val: dateToStr(order.info['date-request']),
                    field: {
                        name: 'date-request',
                        type: 'date'
                    },
                    access: (adminEdit)
                },
                {
                    name: 'Контактные данные клиента',
                    val: order.info.contact,
                    field: {
                        name: 'contact',
                        type: 'text',
                        placeholder: '+765432109'
                    },
                    access: (adminEdit)
                },
                {
                    name: 'Услуга',
                    val: order.info.service.name,
                    field: {
                        name: 'service',
                        type: 'select',
                        dataset: 'services',
                    },
                    access: (adminEdit)
                },
                {
                    name: 'Параметры услуги',
                    val:  order.info.options,
                    field: {
                        name: 'options',
                        type: 'text',
                        placeholder: '10 мБит/с'
                    },
                    access: (adminEdit)
                },
                {
                    name: 'Город',
                    val: `${order.info.city.type} ${order.info.city.name}`,
                    field: {
                        name: 'city',
                        type: 'suggest',
                        dataset: 'cities',
                        placeholder: 'г. Симферополь',
                        required: true
                    },
                    access: (adminEdit)
                },
                {
                    name: 'Улица',
                    val: `${order.info.street}`,
                    field: {
                        name: 'street',
                        type: 'text',
                        placeholder: 'ул. Пушкина',
                        required: true
                    },
                    access: (adminEdit)
                },
                {
                    name: 'д./кв. и т.д',
                    val: `${order.info.adds}`,
                    field: {
                        name: 'adds',
                        type: 'text',
                        placeholder: 'д. Колотушкина, кв.15',
                        required: true
                    },
                    access: (adminEdit)
                },
                {
                    name: 'Необходимость выделения IP-адресов',
                    val: (order.info.ip)?'Да':'Нет',
                    field: {
                        name: 'ip',
                        type: 'boolean'
                    },
                    access: (adminEdit)
                },
                {
                    name: 'Необходимый пул адресов',
                    val: order.info.pool,
                    field: {
                        name: 'pool',
                        type: 'text',
                        placeholder: '/24'
                    },
                    access: (adminEdit)
                },
                {
                    name: 'Ожидаемый единовр. доход (руб)',
                    val: order.info['cost-once'],
                    field: {
                        name: 'cost-once',
                        type: 'text',
                        placeholder: '12345'
                    },
                    access: (adminEdit)
                },
                {
                    name: 'Ожидаемый ежемес. доход (руб)',
                    val: order.info['cost-monthly'],
                    field: {
                        name: 'cost-monthly',
                        type: 'text',
                        placeholder: '123'
                    },
                    access: (adminEdit)
                },
                {
                    name: 'Дополнительная информация',
                    val: order.info.add_info,
                    field: {
                        name: 'add_info',
                        type: 'text',
                        placeholder: 'Возможно завтра будет дождь...'
                    },
                    access: (adminEdit)
                }
            ]
            break;
        case 'gzp':
            fields = [
                {
                    name: 'Фактическая дата проработки заказа',
                    val: dateToStr(order.date['gzp-pre'])
                },
                {
                    name: 'Контрольная дата проработки заказа',
                    val: (order) => {

                        if(order.status != 'gzp-pre' && order.status != 'all-pre' && !order.date['gzp-pre']) return null;


                        if(order.date['client-match']) {
                            var d = new Date(order.date['client-match'].setDate(order.date['client-match'].getDate() + 3));
                            return dateToStr(d);
                        } else {
                            var d = new Date(order.date['init'].setDate(order.date['init'].getDate() + 3))
                            return dateToStr(d);
                        }
                    }
                },
                {
                    name: 'Фактическая дата организации сервиса',
                    val: function (order) {
                        if(order.date['gzp-build'])
                            return dateToStr(order.date['gzp-build']);
                        else return null;
                    }
                },
                {
                    name: 'Фактическая дата активации сервиса',
                    val: function (order) {
                        if(!order.date['gzp-build']) return null;

                        if(order.date['network'])
                            return dateToStr(order.date['network']);
                        else return null;
                    }
                },
                {
                    name: 'Контрольная дата активации сервиса',
                    val: function (order) {
                        if(order.date['client-match'] && order.date['gzp-pre']) {
                            var d = new Date(order.date['client-match'].setDate(order.date['client-match'].getDate(order) + order.gzp.time));
                            return dateToStr(d);
                        }
                    }
                },
                {
                    name: 'Необходимость в ГЗП',
                    access: (adminEdit || ((order.status == 'gzp-pre' || order.status == 'all-pre') && user.department.type == 'gus' &&
                        user.department.cities.indexOf(order.info.city._id) >= 0)),
                    field: {
                        type: 'boolean',
                        name: 'need'
                    },
                    val: function (order) {
                        if(order.gzp.complete)
                            if(order.gzp.need) {
                                return 'Да';
                            } else return 'Нет';
                        else return null;
                    }
                },
                {
                    name: 'Техническая возможность',
                    access: (adminEdit || ((order.status == 'gzp-pre' || order.status == 'all-pre') && user.department.type == 'gus' &&
                        user.department.cities.indexOf(order.info.city._id) >= 0)),
                    field: {
                        type: 'boolean',
                        name: 'capability'
                    },
                    val: function (order) {
                        if(order.gzp.complete)
                            if(order.gzp.capability) {
                                return 'Да';
                            } else return 'Нет';
                        else return null;
                    }
                },
                {
                    name: 'Срок организации',
                    access: (adminEdit || ((order.status == 'gzp-pre' || order.status == 'all-pre') && user.department.type == 'gus' &&
                        user.department.cities.indexOf(order.info.city._id) >= 0)),
                    field: {
                        type: 'text',
                        name: 'time',
                        placeholder: '50'
                    },
                    val: order.gzp.time
                },
                {
                    name: 'Одноразовая стоимость организации',
                    access: (adminEdit || ((order.status == 'gzp-pre' || order.status == 'all-pre') && user.department.type == 'gus' &&
                        user.department.cities.indexOf(order.info.city._id) >= 0)),
                    field: {
                        type: 'text',
                        name: 'cost-once',
                        placeholder: '12345'
                    },
                    val: order.gzp['cost-once']
                },
                {
                    name: 'Операционные затраты ежемесячные',
                    access: (adminEdit || ((order.status == 'gzp-pre' || order.status == 'all-pre') && user.department.type == 'gus' &&
                        user.department.cities.indexOf(order.info.city._id) >= 0)),
                    field: {
                        type: 'text',
                        name: 'cost-monthly',
                        placeholder: '12345'
                    },
                    val: order.gzp['cost-monthly']
                },
                {
                    index: 'add_info',
                    name: 'Дополнительная информация',
                    access: (adminEdit || ((order.status == 'gzp-pre' || order.status == 'all-pre') && user.department.type == 'gus' &&
                        user.department.cities.indexOf(order.info.city._id) >= 0)),
                    field: {
                        type: 'text',
                        name: 'add_info',
                        placeholder: 'Клиент хочет чтобы все было красиво и аккуратно'
                    },
                    val: order.gzp.add_info
                }
            ]
            break;
        case 'stop':
            fields = [
                {
                    name: 'Фактическая дата проработки заказа',
                    val: function (order) {
                        if(order.date['stop-pre'])
                            return dateToStr(order.date['stop-pre']);
                        else return null;
                    }
                },
                {
                    name: 'Контрольная дата проработки заказа',
                    val: function (order) {

                        if(order.status != 'stop-pre' && order.status != 'all-pre' && !order.date['stop-pre']) return null;

                        if(order.date['client-match']) {
                            var d = new Date(order.date['client-match'].setDate(order.date['client-match'].getDate() + 3));
                            return dateToStr(d);
                        } else {
                            var d = new Date(order.date['init'].setDate(order.date['init'].getDate() + 3))
                            return dateToStr(d);
                        }
                    }
                },
                {
                    name: 'Фактическая дата организации сервиса',
                    val: function (order) {
                        if(order.date['stop-build'])
                            return dateToStr(order.date['stop-build']);
                        else return null;
                    }
                },
                {
                    name: 'Фактическая дата активации сервиса',
                    val: function (order) {

                        if(!order.date['stop-build']) return null;

                        if(order.date['network'])
                            return dateToStr(order.date['network']);
                        else return null;
                    }
                },
                {
                    name: 'Контрольная дата активации сервиса',
                    val: function (order) {
                        if(order.date['client-match'] && order.date['stop-pre']) {
                            var d = new Date(order.date['client-match'].setDate(order.date['client-match'].getDate() + order.stop.time));
                            return dateToStr(d);
                        }
                    }
                },
                {
                    name: 'Техническая возможность',
                    access: (adminEdit || ((order.status == 'stop-pre' || order.status == 'all-pre') && user.department.type == 'b2o')),
                    field: {
                        type: 'boolean',
                        required: true,
                        name: 'capability'
                    },
                    val: function (order) {
                        if(order.stop.complete)
                            if(order.stop.capability) {
                                return 'Да';
                            } else return 'Нет';
                        else return null;
                    }
                },
                {
                    name: 'Провайдер',
                    access: (adminEdit || ((order.status == 'stop-pre' || order.status == 'all-pre') && user.department.type == 'b2o')),
                    field: {
                        type: 'suggest',
                        dataset: 'providers',
                        name: 'provider',
                        required: true,
                        placeholder: '[STOP] Ростелеком'
                    },
                    val: function (order) {
                        if(order.stop.complete)
                            return `[${order.stop.provider.type}] ${order.stop.provider.name}`
                        else return null;
                    }
                },
                {
                    name: 'Контакт с провайдером',
                    access: (adminEdit || ((order.status == 'stop-pre' || order.status == 'all-pre') && user.department.type == 'b2o')),
                    field: {
                        type: 'text',
                        name: 'contact',
                        required: true,
                        placeholder: '+79788477422'
                    },
                    val: order.stop.contact
                },
                {
                    name: 'Оборудование',
                    access: (adminEdit || ((order.status == 'stop-pre' || order.status == 'all-pre') && user.department.type == 'b2o')),
                    field: {
                        type: 'text',
                        name: 'devices',
                        placeholder: 'Кабель, шурупы'
                    },
                    val: order.stop.devices
                },
                {
                    name: 'Дополнительное оборудование',
                    access: (adminEdit || ((order.status == 'stop-pre' || order.status == 'all-pre') && user.department.type == 'b2o')),
                    field: {
                        type: 'text',
                        name: 'add_devices',
                        placeholder: 'Молоток, перчатки'
                    },
                    val: order.stop.add_devices
                },
                {
                    name: 'Интерфейсы',
                    access: (adminEdit || ((order.status == 'stop-pre' || order.status == 'all-pre') && user.department.type == 'b2o')),
                    field: {
                        type: 'text',
                        name: 'interfaces',
                        placeholder: 'RJ-45'
                    },
                    val: order.stop.interfaces
                },
                {
                    name: 'Срок организации',
                    access: (adminEdit || ((order.status == 'stop-pre' || order.status == 'all-pre') && user.department.type == 'b2o')),
                    field: {
                        type: 'text',
                        name: 'time',
                        placeholder: '111'
                    },
                    val: order.stop.time
                },
                {
                    name: 'Дополнительная информация',
                    access: (adminEdit || ((order.status == 'stop-pre' || order.status == 'all-pre') && user.department.type == 'b2o')),
                    field: {
                        type: 'text',
                        name: 'add_info',
                        placeholder: 'Провайдер конечно хуже чем мы, но другого выхода нет'
                    },
                    val: order.stop.add_info
                },
                {
                    name: 'Информация об организации',
                    access: (adminEdit || ((order.status == 'stop-pre' || order.status == 'all-pre') && user.department.type == 'b2o')),
                    field: {
                        type: 'text',
                        name: 'organization_info',
                        placeholder: 'Так себе организация'

                    },
                    val: order.stop.organization_info
                },
                {
                    name: 'Одноразовая стоимость организации',
                    access: (adminEdit || ((order.status == 'stop-pre' || order.status == 'all-pre') && user.department.type == 'b2o')),
                    field: {
                        type: 'text',
                        name: 'cost-once',
                        placeholder: '1000'
                    },
                    val: order.stop['cost-once']
                },
                {
                    name: 'Ежемесячная стоимость организации',
                    access: (adminEdit || ((order.status == 'stop-pre' || order.status == 'all-pre') && user.department.type == 'b2o')),
                    field: {
                        type: 'text',
                        name: 'cost-monthly',
                        placeholder: '100'
                    },
                    val: order.stop['cost-monthly']
                }
            ]
            break;
    }

    var ret = [];

    fields.forEach(item => {

        item.val = (typeof item.val == 'function')?item.val(order):item.val;

        if(item.access) {
            var input;

            switch (item.field.type) {
                case 'text':
                    input = {
                        block: 'input',
                        name: item.field.name,
                        mods: {
                            width: 'available',
                            theme: 'islands',
                            size: 'l'
                        },
                        placeholder: item.field.placeholder
                    }
                    break;
                case 'select':
                    input = {
                        block: 'select',
                        name: item.field.name,
                        mods: {
                            mode: 'radio',
                            theme: 'islands',
                            size: 'l'
                        },
                        options: dataset[item.field.dataset]
                    }
                    break;
                case 'boolean':
                    input = {
                        block: 'select',
                        name: item.field.name,
                        mods: {
                            mode: 'radio',
                            theme: 'islands',
                            size: 'l'
                        },
                        val: 1 || item.val,
                        options: [
                            {
                                val: 0,
                                text: 'Нет'
                            },
                            {
                                val: 1,
                                text: 'Да'
                            }
                        ]
                    }
                    break;
                case 'suggest':
                    input = {
                        block : 'suggest',
                        mods : {
                            theme : 'islands',
                            size : 'l',
                            'has-dataprovider' : 'adress'
                        },
                        placeholder: item.field.placeholder,
                        name: item.field.name,
                        dataprovider: {
                            data: dataset[item.field.dataset]
                        }
                    }
                    break;
            }

            ret.push({
                elem: 'body-row',
                content: [
                    {
                        elem: 'body-row-name',
                        content: item.name
                    },
                    {
                        elem: 'body-row-data',
                        content: input
                    },
                    {
                        elem: 'body-row-symbol'
                    }
                ]
            })
        } else {
            if(item.val != null) {
                ret.push({
                    elem: 'body-row',
                    content: [
                        {
                            elem: 'body-row-name',
                            content: item.name
                        },
                        {
                            elem: 'body-row-data',
                            content: item.val
                        },
                        {
                            elem: 'body-row-symbol'
                        }
                    ]
                })
            }
        }


    })
    return [
        ret,
        {
            elem: 'actions',
            order: order,
            user: user,
            tab: this.ctx.tab
        }
    ];
})

function dateToStr (value) {
    if(value) {
        var year = value.getFullYear();
        var month = value.getMonth() + 1;
        if(month < 10) {
            month = '0' + month;
        }
        var day = value.getDate();
        if(day < 10) {
            day = '0' + day;
        }
        return `${day}-${month}-${year}`;
    } else return null;
}
