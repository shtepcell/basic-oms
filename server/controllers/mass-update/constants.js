
const ALL_FIELDS = [
    'Клиент',
    'Тип клиента',
    'Контактные данные клиента',
    'Тип населённого пункта',
    'Наименование н.п',
    'Полный адрес по координатам',
    'Услуга',
    'Емкость Мб/с',
    'Количество IP адресов',
    'Отправить на проработку',
    'Дополнительная информация',
    'Номер CMS',
];

const SUPPORTED_SERVICES = ['Интернет', 'L3VPN'];
const SUPPORTED_CITY_TYPES = ['пгт.', 'г.', 'с.', 'пос.', 'мыс.'];
const SUPPORTED_STATUSES = ['только ГЗП', 'только СТОП', 'ГЗП и СТОП'];

const STATUSES_HASH = {
    'только ГЗП': 'gzp-pre',
    'только СТОП': 'stop-pre',
    'ГЗП и СТОП': 'all-pre',
}

const SERVICES_HASH = {
    'Интернет': 'internet',
    'L3VPN': 'l3vpn'
}

module.exports = { ALL_FIELDS, SUPPORTED_SERVICES, SUPPORTED_STATUSES, SUPPORTED_CITY_TYPES, STATUSES_HASH, SERVICES_HASH };
