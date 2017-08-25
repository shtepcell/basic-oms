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
            type: 'Date'
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
            type: 'String',
            fill: true,
            value: 'relation'
        },
        {
            index: 'initiator-name',
            name: 'Ф.И.О. инициатора',
            type: 'default',
            fill: true
        },
        {
            index: 'initiator-dep',
            name: 'Подразделение-инициатор',
            type: 'default',
            fill: true
        },
        {
            index: 'date-request',
            name: 'Требуемая дата организации',
            type: 'Date',
            fill: true
        },
        {
            index: 'cms',
            name: 'Номер сервиса в CMS',
            maxLenght: 50,
            type: 'String',
            fill: true
        },
        {
            index: 'cost-once',
            name: 'Ожидаемый единовр. доход (руб)',
            maxLenght: 50,
            type: 'String',
            fill: true
        },
        {
            index: 'cost-monthly',
            name: 'Ожидаемый ежемес. доход (руб)',
            maxLenght: 50,
            type: 'String',
            fill: true
        },
        {
            index: 'add_info',
            name: 'Дополнительная информация',
            type: 'String',
            fill: true
        },
        {
            index: 'service',
            name: 'Услуга',
            type: 'Service',
            fill: true
        },
        {
            index: 'options',
            name: 'Параметры услуги',
            maxLenght: 50,
            type: 'String',
            fill: true
        },
        {
            index: 'client',
            name: 'Клиент',
            type: 'Client',
            fill: true
        },
        {
            index: 'contact',
            name: 'Контактные данные клиента',
            type: 'String',
            fill: true
        },
        {
            index: 'ip',
            name: 'Необходимость выделения IP-адресов',
            type: 'Boolean',
            fill: true
        },
        {
            index: 'pool',
            name: 'Необходимый пул адресов',
            type: 'String',
            fill: true
        }
    ]
    // gzp: {
    //     'date-work': {
    //         name: 'Дата проработки заказа',
    //         type: 'Date'
    //     },
    //     'date-work-control': {
    //         name: 'Контрольная дата проработки заказа',
    //         type: 'Date'
    //     },
    //     'date-build': {
    //         name: 'Дата организации заказа',
    //         type: 'Date'
    //     },
    //     'date-build-control': {
    //         name: 'Контрольная дата организации заказа',
    //         type: 'Date'
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
    //         date: 'Date',
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
    //         type: 'String',
    //         maxLenght: 50,
    //         fill: true
    //     },
    //     devices: {
    //         name: 'Оборудование',
    //         type: 'String',
    //         maxLenght: 50,
    //         fill: true
    //     },
    //     add_devices: {
    //         name: 'Дополнительное оборудование',
    //         type: 'String',
    //         maxLenght: 50,
    //         fill: true
    //     },
    //     interfaces: {
    //         name: 'Интерфейсы',
    //         type: 'String',
    //         maxLenght: 50,
    //         fill: true
    //     },
    //     time: {
    //         name: 'Срок организации',
    //         type: 'String',
    //         maxLenght: 50,
    //         fill: true
    //     },
    //     add_info: {
    //         name: 'Дополнительная информация',
    //         type: 'String',
    //         maxLenght: 50,
    //         fill: true
    //     },
    //     organization_info: {
    //         name: 'Информация об организации',
    //         type: 'String',
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
    // address: {
    //     city: {
    //         name: 'Город',
    //         type: 'City',
    //         fill: true
    //     },
    //     street: {
    //         name: 'Улица',
    //         type: 'Street',
    //         fill: true
    //     },
    //     adds: {
    //         name: 'д./кв. и т.д',
    //         type: 'String',
    //         maxLenght: 50,
    //         fill: true
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
    //         type: 'Date',
    //         fill: true
    //     }
    // }
}

module.exports = allFields;
