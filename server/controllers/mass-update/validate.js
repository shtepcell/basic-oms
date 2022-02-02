const { ALL_FIELDS, SUPPORTED_SERVICES, SUPPORTED_CITY_TYPES, SUPPORTED_STATUSES  } = require('./constants');
const { types } = require('../../common-data');

const Client = require("../../models/Client")
const City = require("../../models/City")

const clientValidator = async (value) => {
    if (!value) {
        return `Клиент - обязательное поле`;
    }

    const client = await Client.findOne({ name: value }).lean();

    if (!client) {
        return `Клиент ${value} не найден`;
    }
}

const clientTypeValidator = (value) => {
    if (!value) {
        return `Тип клиента - обязательное поле`;
    }
    
    if (!types.types.includes(value)) {
        return `Неизвестный тип клиента ${value}`
    }
}

const serviceValidator = (value) => {
    if (!value) {
        return `Услуга - обязательное поле`;
    }

    if (!SUPPORTED_SERVICES.includes(value)) {
        return `Услуга ${value} не доступна для массовой загрузки`
    }
}

const cityValidator = async(value, order) => {
    const type = order['Тип населённого пункта'];

    if (!type) {
        return `Тип населённого пункта - обязательное поле`;
    }

    if(!SUPPORTED_CITY_TYPES.includes(type)) {
        return `Неизвестный тип населённого пункта "${type}"`
    }

    const city = await City.findOne({ type, name: value }).lean();

    if (!city) {
        return `Населенный пункт ${type} ${value} не найден`
    }
}

const statusValidator = (value) => {
    if (!value) {
        return `Отправить на проработку - обязательное поле`;
    }

    if (!SUPPORTED_STATUSES.includes(value)) {
        return `Неизвестный параметр "${value}". Доступны: ${SUPPORTED_STATUSES.join(', ')}`
    }
}

const requiredValidator = (field) => (value) => {
    if (!value) {
        return `${field} - обязательное поле`
    }
}

const VALIDATE_FUNCTIONS = {
    'Клиент': clientValidator,
    'Тип клиента': clientTypeValidator,
    'Услуга': serviceValidator,
    'Контактные данные клиента': requiredValidator('Контактные данные клиента'),
    'Наименование н.п': cityValidator,
    'Полный адрес по координатам': requiredValidator('Полный адрес по координатам'),
    'Емкость Мб/с': requiredValidator('Емкость Мб/с'),
    'Количество IP адресов': requiredValidator('Количество IP адресов'),
    'Отправить на проработку': statusValidator,
};

const empty = () => {};

const validateField = (field) => {
    return VALIDATE_FUNCTIONS[field] || empty;
}

const validateOrder = (order, id) => {
    const promises = ALL_FIELDS.map((field) => validateField(field)(order[field], order));

    return Promise.all(promises).then((data) => {
        const errors = data.filter(Boolean);

        if (errors.length === 0) {
            return null;
        }

        return { id: id + 2, errors } ;
    })
}

module.exports = { validateOrder };