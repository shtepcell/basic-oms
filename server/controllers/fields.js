module.exports = function () {
    return {
        'id': {
            name: 'Номер заказа',
            type: 'default'
        },
        'status': {
            name: 'Текущий статус',
            type: 'default'
        },
        'service.name': {
            name: 'Услуга',
            type: 'Service'
        },
        'service.options': {
            name: 'Параметры услуги',
            maxLenght: 50,
            type: 'String'
        },
        'client.name': {
            name: 'Клиент',
            type: 'Client'
        },
        'init.reqData': {
            name: 'Требуемая дата организации',
            type: 'Date'
        },
        'init.contract': {
            name: 'Номер договора',
            maxLenght: 50,
            type: 'String'
        },
        'gzp.need': {
            name: 'Необходимость в ГЗП',
            type: 'Boolean'
        },
        'gzp.capability': {
            name: 'Техническая возможность',
            type: 'Boolean'
        },
        'gzp.time': {
            name: 'Срок организации',
            date: 'Date'
        },
        'gzp.cost.once': {
            name: 'Одноразовая стоимость организации',
            type: 'Number'
        },
        'gzp.cost.monthly': {
            name: 'Ежемесячная стоимость организации',
            type: 'Number'
        },
        'stop.capability': {
            name: 'Техническая возможность',
            type: 'Boolean'
        },
        'stop.provider': {
            name: 'Провайдер',
            type: 'Provider'
        },
        'stop.contact': {
            name: 'Контакт с провайдером',
            type: 'String',
            maxLenght: 50
        },
        'stop.devices': {
            name: 'Оборудование',
            type: 'String',
            maxLenght: 50
        },
        'stop.add_devices': {
            name: 'Дополнительное оборудование',
            type: 'String',
            maxLenght: 50
        },
        'stop.interfaces': {
            name: 'Интерфейсы',
            type: 'String',
            maxLenght: 50
        },
        'stop.time': {
            name: 'Срок организации',
            type: 'String',
            maxLenght: 50
        },
        'stop.add_info': {
            name: 'Дополнительная информация',
            type: 'String',
            maxLenght: 50
        },
        'stop.organization_info': {
            name: 'Информация об организации',
            type: 'String',
            maxLenght: 50
        },
        'stop.cost.once': {
            name: 'Одноразовая стоимость организации',
            type: 'Number'
        },
        'stop.cost.monthly': {
            name: 'Ежемесячная стоимость организации',
            type: 'Number',
            maxLenght: 50
        },
        'address.city': {
            name: 'Город',
            type: 'City'
        },
        'address.street': {
            name: 'Улица',
            type: 'Street'
        },
        'address.adds': {
            name: 'д./кв. и т.д',
            type: 'String',
            maxLenght: 50
        },
        'close.file': {
            name: 'Договор',
            type: 'File'
        },
        'close.date': {
            name: 'Дата подписания договора',
            type: 'Date'
        },
    }
};
