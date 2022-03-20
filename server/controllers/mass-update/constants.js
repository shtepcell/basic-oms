const FIELDS_HASH = {
    client: "Клиент",
    clientType: "Тип клиента",
    clientContact: "Контактные данные клиента",
    cityType: "Тип населённого пункта",
    cityName: "Наименование н.п",
    coordinates: "Полный адрес по координатам",
    service: "Услуга",
    capacity: "Емкость Мб/с",
    ips: "Количество IP адресов",
    additional: "Дополнительная информация",
    cms: "Номер CMS",
    provider: "Оператор ПМ из СУЗ",
    onceCost: "Единоразовая стоимость организации",
    monthlyCost: "Операционные затраты ежемесячные",
    expectedOnceIncome: "Ожидаемый единовр. доход (руб)",
    expectedMonthlyIncome: "Ожидаемый ежемес. доход (руб)",
    status: "Статус заявки",
    preStatus: "Отправить на проработку",
};

const G = "г.";
const PGT = "пгт.";
const S = "с.";
const POS = "пос.";
const MIS = "мыс.";

const CITY_TYPES_HASH = {
    город: G,
    поселок: POS,
    "поселок городского типа": PGT,
    село: S,
    мыс: MIS,
};
const ALL_FIELDS = Object.values(FIELDS_HASH);

const SUPPORTED_SERVICES = ["Интернет", "L3VPN"];

const SUPPORTED_CITY_TYPES = [
    G,
    PGT,
    S,
    POS,
    MIS,
    ...Object.keys(CITY_TYPES_HASH),
];

const SUPPORTED_STATUSES = ["только ГЗП", "только СТОП", "ГЗП и СТОП"];

const STATUSES_HASH = {
    "только ГЗП": "gzp-pre",
    "только СТОП": "stop-pre",
    "ГЗП и СТОП": "all-pre",
    "Включено ГЗП": "succes",
    "Включено СТОП/VSAT": "succes",
};

const SERVICES_HASH = {
    Интернет: "internet",
    L3VPN: "l3vpn",
};

const SUPPORTED_END_STATUSES = ["Включено ГЗП", "Включено СТОП/VSAT"];

module.exports = {
    ALL_FIELDS,
    SUPPORTED_SERVICES,
    SUPPORTED_STATUSES,
    SUPPORTED_CITY_TYPES,
    STATUSES_HASH,
    SERVICES_HASH,
    SUPPORTED_END_STATUSES,
    FIELDS_HASH,
    CITY_TYPES_HASH,
};
