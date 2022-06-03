const {
    ALL_FIELDS,
    SUPPORTED_SERVICES,
    SUPPORTED_CITY_TYPES,
    SUPPORTED_STATUSES,
    FIELDS_HASH,
    SUPPORTED_END_STATUSES,
} = require("./constants");
const { types } = require("../../common-data");

const Client = require("../../models/Client");
const City = require("../../models/City");
const Provider = require("../../models/Provider");
const Order = require("../../models/Order");
const { getProvider, getCity, isRelationNeeded, isIPNeeded, isCapacityNeeded } = require("./helpers");

const clientValidator = async (value) => {
    if (!value) {
        return `Клиент - обязательное поле`;
    }

    const client = await Client.findOne({ name: value }).lean();

    if (!client) {
        return `Клиент ${value} не найден`;
    }
};

const clientTypeValidator = (value) => {
    if (!value) {
        return `Тип клиента - обязательное поле`;
    }

    if (!types.types.includes(value)) {
        return `Неизвестный тип клиента ${value}`;
    }
};

const serviceValidator = (value) => {
    if (!value) {
        return `Услуга - обязательное поле`;
    }

    if (!SUPPORTED_SERVICES.includes(value)) {
        return `Услуга ${value} не доступна для массовой загрузки`;
    }
};

const cityValidator = async (value = "", order) => {
    const { type, name } = getCity(order);

    if (!type) {
        return `Тип населённого пункта - обязательное поле`;
    }

    if (!SUPPORTED_CITY_TYPES.includes(type)) {
        return `Неизвестный тип населённого пункта "${type}"`;
    }

    const city = await City.findOne({ type, name }).lean();

    if (!city) {
        return `Населенный пункт ${type} ${value} не найден`;
    }
};

const providerValidator = async (value, order) => {
    const isStop =
        order[FIELDS_HASH.status] &&
        order[FIELDS_HASH.status].match(/Включено СТОП\/VSAT/);

    if (!isStop) {
        return;
    }

    if (isStop && (!value || !value.trim())) {
        return `${FIELDS_HASH.provider} – обязательное поле для заявок включенных через СТОП`;
    }

    let { type, name } = getProvider(order);

    if ((!type || !name) && isStop) {
        return `${FIELDS_HASH.provider} – некоректные данные (${value})`;
    }

    const provider = await Provider.findOne({ name, type });

    if (!provider) {
        return `Провайдер [${type}] ${name} не найден`;
    }
};

const statusValidator = (value) => {
    if (!value) {
        return `Отправить на проработку - обязательное поле`;
    }

    if (!SUPPORTED_STATUSES.includes(value)) {
        return `Неизвестный параметр "${value}". Доступны: ${SUPPORTED_STATUSES.join(
            ", "
        )}`;
    }
};

const endStatusValidator = (value) => {
    if (value && !SUPPORTED_END_STATUSES.includes(value)) {
        return `Неизвестный параметр "${value}". Доступны: ${SUPPORTED_END_STATUSES.join(
            ", "
        )}`;
    }
};

const requiredValidator = (field) => (value) => {
    if (!value) {
        return `${field} - обязательное поле`;
    }
};

const relationValidator = async (value, order) => {
    if (isRelationNeeded(order)) {
        if (!value) {
            return `${FIELDS_HASH.relation} – обязательное поле для услуги "${order[FIELDS_HASH.service]}"`;
        }

        const relation = await Order.findOne({ id: value }).lean();

        if (!relation) {
            return `Заказ с ID ${value} не найден`;
        }
    }
}

const ipValidator = async (value, order) => {
    if (isIPNeeded(order)) {
        if (!value) {
            return `${FIELDS_HASH.ips} – обязательное поле`;
        }
    }
}

const capacityValidator = async (value, order) => {
    if (isCapacityNeeded(order)) {
        if (!value) {
            return `${FIELDS_HASH.capacity} – обязательное поле`;
        }
    }
}

const VALIDATE_FUNCTIONS = {
    [FIELDS_HASH.client]: clientValidator,
    [FIELDS_HASH.clientType]: clientTypeValidator,
    [FIELDS_HASH.service]: serviceValidator,
    [FIELDS_HASH.clientContact]: requiredValidator(FIELDS_HASH.clientContact),
    [FIELDS_HASH.cityName]: cityValidator,
    [FIELDS_HASH.coordinates]: requiredValidator(FIELDS_HASH.coordinates),
    [FIELDS_HASH.capacity]: capacityValidator,
    [FIELDS_HASH.ips]: ipValidator,
    [FIELDS_HASH.preStatus]: statusValidator,
    [FIELDS_HASH.status]: endStatusValidator,
    [FIELDS_HASH.provider]: providerValidator,
    [FIELDS_HASH.relation]: relationValidator,
};

const empty = () => { };

const validateField = (field) => {
    return VALIDATE_FUNCTIONS[field] || empty;
};

const validateOrder = (order, id) => {
    const promises = ALL_FIELDS.map((field) =>
        validateField(field)(order[field], order)
    );

    return Promise.all(promises).then((data) => {
        const errors = data.filter(Boolean);

        if (errors.length === 0) {
            return null;
        }

        return { id: id + 2, errors };
    });
};

module.exports = { validateOrder };
