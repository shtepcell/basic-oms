const Order = require('../../models/Order');
const Static = require('../../models/Static');
const City = require('../../models/City');
const Client = require('../../models/Client');

const helper = require('../helper');

const { validateOrder } = require('./validate');
const { STATUSES_HASH, SERVICES_HASH } = require('./constants')

const XLSX = require('xlsx');

const errorHandler = (error, req, res) => {
    if (error.code) {
        return res.status(400).json(error);
    }

    return res.status(500);
}

const errorWrapper = (fn) => (...args) => {
    fn(...args).catch((err) => errorHandler(err, ...args));
}

const parseFile = (file) => {
    try { 
        const sheet = XLSX.read(file.data, { type: 'buffer' });
        if (!sheet.Sheets['Import']) {
            throw {};
        }
    
        return XLSX.utils.sheet_to_json(sheet.Sheets['Import']);
    } catch {
        throw { code: 'PARSING_ERROR' };
    }
}

const validateData = async(data) => {
    const promises = data.map(validateOrder);
    
    return Promise.all(promises).then((data) => {
        const errors = data.filter(Boolean);

        if (errors.length > 0) {
            throw { code: 'VALIDATE_ERROR', data: errors };
        }
    })
}

const validateOrders = async(req, res) => {
    const file = req.files.xlsx;
    const data = parseFile(file);
    
    await validateData(data);

    return res.sendStatus(200);
}

const importOrder = async(data, user) => {
    const status = STATUSES_HASH[data['Отправить на проработку']];
    const city = await City.findOne({ type: data['Тип населённого пункта'], name: data['Наименование н.п'] });
    const client = await Client.findOne({ name: data['Клиент'] });
    const clientType = data['Тип клиента'];
    const contact = data['Контактные данные клиента'];
    const coordinate = data['Полный адрес по координатам'];
    const service = SERVICES_HASH[data['Услуга']];
    const volume = data['Емкость Мб/с'];
    const ipCount = data['Количество IP адресов'];
    const additionalInfo = data['Дополнительная информация'];
    const cms = data['Номер CMS'];
    var deadline = await helper.calculateDeadline(3);

    const order = new Order({
        id: await Static.getOrderId(),
        status: status,
        deadline,
        info: {
            initiator: user._id,
            department: user.department._id,
            cms,
            add_info: additionalInfo,
            client,
            clientType,
            contact,
            service,
            city,
            coordinate,
            volume,
            ip: ipCount,
        },
        date: {
            init: new Date(),
            'cs-gzp-pre': (status === 'gzp-pre' || status === 'all-pre') ? deadline : undefined,
            'cs-stop-pre': (status === 'stop-pre' || status === 'all-pre') ? deadline : undefined,
        },
        history: [helper.historyGenerator('init', user)],
        tech: {
            mass_upload: true,
        }
    });

    return order.save();
}

const importOrders = async(req, res) => {
    const file = req.files.xlsx;
    const data = parseFile(file);

    await validateData(data);
    
    const orders = [];

    for (const item of data) {
        const order = await importOrder(item, res.locals.__user);
        orders.push(order.id);
    }

    return res.status(200).json({ orders });
}

module.exports = { validateOrders: errorWrapper(validateOrders), importOrders: errorWrapper(importOrders) };
