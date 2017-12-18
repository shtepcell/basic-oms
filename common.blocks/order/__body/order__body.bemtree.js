block('order').elem('body').content()(function () {
    var order = this.ctx.order,
        tab = this.ctx.tab,
        user = this.ctx.user,
        init = this.ctx.init,
        adminEdit = this.ctx.admin,
        dataset = this.ctx.dataset;

    if(tab == 'history') {
        var ret = [];
        if(!order.history) {
            return [];
        }

        ret = order.history.map( item => {
            return {
                elem: 'body-row',
                content: [
                    {
                        elem: 'body-row-name',
                        content: `${item.name}`
                    },
                    {
                        elem: 'body-row-name',
                        mix: {
                            elem: 'body-date'
                        },
                        content: `${dateToExtStr(item.date)}`
                    },
                    {
                        elem: 'body-row-name',
                        content: `[${item.author.department.name}] ${item.author.name} `
                    }
                ]
            }
        })
        return ret;
    }

    var fields;

    switch (tab) {
        case 'init':
            fields = [
                {
                    name: 'Связанные заявки',
                    field: {
                        name: 'relation',
                        type: 'text',
                        placeholder: '#1234 #4321'
                    },
                    val: null,
                    access: true
                },
                {
                    name: 'Номер CMS',
                    field: {
                        name: 'cms',
                        type: 'text',
                        placeholder: '12-2222-23'
                    },
                    val: null,
                    access: true
                },
                'separator',
                {
                    name: 'Клиент',
                    field: {
                        name: 'client',
                        type: 'suggest',
                        dataset: 'clients',
                        placeholder: 'РНКБ',
                        required: true
                    },
                    val: null,
                    access: true
                },
                {
                    name: 'Контактные данные клиента',
                    field: {
                        name: 'contact',
                        type: 'text',
                        placeholder: '+765432109'
                    },
                    val: null,
                    access: true
                },
                {
                    name: 'Услуга',
                    field: {
                        name: 'service',
                        type: 'select',
                        dataset: 'services',
                    },
                    val: null,
                    access: true
                },
                {
                    name: 'Параметры услуги',
                    field: {
                        name: 'options',
                        type: 'text',
                        placeholder: '10 мБит/с'
                    },
                    val: null,
                    access: true
                },
                {
                    name: 'Город',
                    field: {
                        name: 'city',
                        type: 'suggest',
                        dataset: 'cities',
                        placeholder: 'г. Симферополь',
                        required: true
                    },
                    val: null,
                    access: true
                },
                {
                    name: 'Улица',
                    field: {
                        name: 'street',
                        type: 'suggest',
                        dataset: 'streets',
                        required: true,
                        placeholder: 'ул. Пушкина'
                    },
                    val: null,
                    access: true
                },
                {
                    name: 'д./кв. и т.д',
                    field: {
                        name: 'adds',
                        type: 'text',
                        placeholder: 'д.32, кв.15',
                        required: true
                    },
                    val: null,
                    access: true
                },
                'separator',
                {
                    name: 'Необходимость выделения IP-адресов',
                    field: {
                        name: 'ip',
                        type: 'boolean'
                    },
                    val: null,
                    access: true
                },
                {
                    name: 'Необходимый пул адресов',
                    field: {
                        name: 'pool',
                        type: 'text',
                        placeholder: '/24'
                    },
                    val: null,
                    access: true
                },
                {
                    name: 'Дополнительная информация',
                    field: {
                        name: 'add_info',
                        type: 'text',
                        placeholder: 'Возможно завтра будет дождь...'
                    },
                    val: null,
                    access: true
                },
                {
                    name: 'Отправить на проработку',
                    field: {
                        name: 'pre',
                        type: 'select',
                        dataset: 'pre'
                    },
                    val: null,
                    access: true
                }
            ]
            break;
        case 'info':
            fields = [
                {
                    name: 'Дата инициации заказа',
                    val: dateToStr(order.date.init)
                },
                {
                    name: 'Связанные заявки',
                    field: {
                        name: 'relation',
                        type: 'text',
                        placeholder: '#1234 #4321'
                    },
                    val: order.info.relation,
                    access: (adminEdit)
                },
                {
                    name: 'Номер CMS',
                    field: {
                        name: 'cms',
                        type: 'text',
                        placeholder: '12-2222-23'
                    },
                    val: order.info.cms,
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
                'separator',
                {
                    name: 'Клиент',
                    val: order.info.client.name,
                    field: {
                        name: 'client',
                        type: 'suggest',
                        dataset: 'clients',
                        placeholder: 'РНКБ',
                        required: true
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
                    val: (order) => {
                        if(adminEdit) return order.info.service._id + '';
                        else return order.info.service.name;
                    },
                    field: {
                        name: 'service',
                        type: 'select',
                        dataset: 'services',
                    },
                    access: (adminEdit)
                },
                {
                    name: 'Параметры услуги',
                    val: order.info.options,
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
                        type: 'suggest',
                        dataset: 'streets',
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
                'separator',
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
                        required: true,
                        type: 'text',
                        placeholder: '12345'
                    },
                    access: (adminEdit || ((user.department._id+'' == order.info.initiator.department._id+'') && order.status == 'client-match') )
                },
                {
                    name: 'Ожидаемый ежемес. доход (руб)',
                    val: order.info['cost-monthly'],
                    field: {
                        name: 'cost-monthly',
                        required: true,
                        type: 'text',
                        placeholder: '123'
                    },
                    access: (adminEdit || ((user.department._id+'' == order.info.initiator.department._id+'') && order.status == 'client-match') )
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
                },
                'separator',
                {
                    name: 'Договор',
                    val: order.info.order,
                    field: {
                        name: 'order',
                        type: 'file'
                    },
                    access: (adminEdit || (order.status == 'client-notify' && order.info.initiator.department._id == user.department._id + ''))
                },
                {
                    name: 'Дата подписания акта',
                    val: dateToStr(order.info['date-sign']),
                    field: {
                        name: 'date-sign',
                        type: 'date'
                    },
                    access: (adminEdit || (order.status == 'client-notify' && order.info.initiator.department._id == user.department._id + ''))
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
                        var date = dateToStr(order.date['cs-gzp-pre']);
                        if (date) return date;
                        else return null;
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
                    val: (order) => {
                        var date = dateToStr(order.date['cs-gzp-organization']);
                        if (date) return date;
                        else return null;
                    }
                },
                'separator',
                {
                    name: 'Необходимость в ГЗП',
                    access: (adminEdit || ((order.status == 'gzp-pre' || order.status == 'all-pre') && user.department.type == 'gus' &&
                        user.department.cities.indexOf(order.info.city._id) >= 0)),
                    field: {
                        type: 'boolean',
                        name: 'need',
                        default: 1
                    },
                    val: function (order) {
                        if(order.gzp.capability != undefined)
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
                        name: 'capability',
                        default: 1
                    },
                    val: function (order) {
                        if(order.gzp.capability != undefined)
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
                        required: true,
                        placeholder: '50'
                    },
                    val: order.gzp.time
                },
                'separator',
                {
                    name: 'Одноразовая стоимость организации',
                    access: (adminEdit || ((order.status == 'gzp-pre' || order.status == 'all-pre') && user.department.type == 'gus' &&
                        user.department.cities.indexOf(order.info.city._id) >= 0)),
                    field: {
                        type: 'text',
                        name: 'cost-once',
                        required: true,
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
                        required: true,
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
                    val: (order) => {
                        var date = dateToStr(order.date['cs-stop-pre']);
                        if (date) return date;
                        else return null;
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
                    val: (order) => {
                        var date = dateToStr(order.date['cs-stop-organization']);
                        if (date) return date;
                        else return null;
                    }
                },
                'separator',
                {
                    name: 'Техническая возможность',
                    access: (adminEdit || ((order.status == 'stop-pre' || order.status == 'all-pre') && user.department.type == 'b2o')),
                    field: {
                        type: 'boolean',
                        required: true,
                        name: 'capability',
                        default: 1
                    },
                    val: function (order) {
                        if(order.stop.capability != undefined)
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
                        if(order.stop.provider)
                            return `[${order.stop.provider.type}] ${order.stop.provider.name}`
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
                        required: true,
                        placeholder: '111'
                    },
                    val: order.stop.time
                },
                'separator',
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
                        required: true,
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
                        required: true,
                        placeholder: '100'
                    },
                    val: order.stop['cost-monthly']
                }
            ]
            break;
    }

    var ret = [];

    fields.forEach(item => {
        if(item == 'separator') {
            ret.push({
                block: 'order',
                elem: 'separator'
            });
            return;
        }

        item.val = (typeof item.val == 'function')?item.val(order):item.val;

        if(item.access) {
            var input;

            switch (item.field.type) {
                case 'text':
                    input = {
                        block: 'input',
                        name: item.field.name,
                        required: item.field.required,
                        val: item.val,
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
                        val: item.val,
                        mods: {
                            mode: 'radio',
                            theme: 'islands',
                            size: 'l'
                        },
                        options: dataset[item.field.dataset]
                    }
                    break;
                case 'boolean':
                    var costil;
                    if(item.val==undefined) {
                        costil = item.field.default;
                    } else costil = (item.val=='Да')?1:0;

                    input = {
                        block: 'select',
                        name: item.field.name,
                        mods: {
                            mode: 'radio',
                            theme: 'islands',
                            size: 'l'
                        },
                        val: costil,
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
                        required: item.field.required,
                        val: item.val,
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
                case 'date':
                    input = {
                        block: 'input',
                        val: item.val,
                        mods: {
                            'has-calendar': true,
                            size: 'm',
                            theme: 'islands'
                        },
                        required: item.field.required,
                        name: item.field.name,
                        weekdays: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
                        months: ['Январь', 'Февраль', 'Март',
                            'Апрель', 'Май', 'Июнь',
                            'Июль', 'Август', 'Сентябрь',
                            'Октябрь', 'Ноябрь', 'Декабрь'],
                        val: item.val
                    }
                    break;
                case 'file':
                    input = {
                        block: 'attach',
                        name: item.field.name,
                        mods: {
                            theme: 'islands',
                            size: 'l'
                        },
                        button: 'Выберите файл',
                        noFileText: (item.val)?`Файл загружен - ${item.val}`:'Файл не выбран'
                    };
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

                if(item.field && item.field.name == 'relation') {

                    var links = [];
                    var numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

                    for (var i = 0; i < item.val.length; i++) {

                        if(item.val[i] == '#') {
                            var l = '';

                            for (var j = i+1; j < item.val.length; j++) {
                                if(numbers.indexOf(item.val[j]) >= 0) {
                                    l += item.val[j];
                                } else {
                                    if(l.length > 0) {
                                        links.push(l);
                                    }
                                    j = item.val.length;
                                }
                                if(j == item.val.length - 1) {
                                    links.push(l);
                                }
                            }
                        }

                    }

                    links.forEach( link => {
                        item.val = item.val.replace('#'+link, `<a class="link link_theme_islands" href="/order/${link}">#${link}</a>`);
                    })

                    ret.push ({
                        elem: 'body-row',
                        content: [
                            {
                                elem: 'body-row-name',
                                content: item.name
                            },
                            {
                                elem: 'body-row-data',
                                content: {
                                    html: item.val
                                }
                            },
                            {
                                elem: 'body-row-symbol'
                            }
                        ]
                    })
                } else {

                if(item.field && item.field.type == 'file') {
                    ret.push ({
                        elem: 'body-row',
                        content: [
                            {
                                elem: 'body-row-name',
                                content: item.name
                            },
                            {
                                elem: 'body-row-data',
                                content: [
                                    {
                                        block: 'link',
                                        mods : { theme : 'islands', size : 'm'},
                                        url: `/order/${order.id}/file/${item.val}`,
                                        content : item.val
                                    }
                                ]
                            },
                            {
                                elem: 'body-row-symbol'
                            }
                        ]
                    })
                } else
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
        }


    })

    if(ret.length <= 2) ret = [];
    return [
        ret,
        {
            elem: 'actions',
            department: this.ctx.department,
            order: order,
            admin: adminEdit,
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
        return `${day}.${month}.${year}`;
    } else return null;
}

function dateToExtStr (value = new Date()) {
    var hour = value.getHours();
    if(hour < 10) {
        hour = '0' + hour;
    }
    var min = value.getMinutes();
    if(min < 10) {
        min = '0' + min;
    }
    var sec = value.getSeconds();
    if(sec < 10) {
        sec = '0' + sec;
    }
    return `${dateToStr(value)} ${hour}:${min}:${sec}`;
}
