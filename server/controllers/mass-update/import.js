const Order = require("../../models/Order");
const Static = require("../../models/Static");
const City = require("../../models/City");
const Client = require("../../models/Client");

const helper = require("../helper");

const { validateOrder } = require("./validate");
const {
    STATUSES_HASH,
    SERVICES_HASH,
    FIELDS_HASH,
    SUPPORTED_END_STATUSES,
} = require("./constants");

const XLSX = require("xlsx");
const Provider = require("../../models/Provider");
const { getProvider, getCity, isRelationNeeded, isIPNeeded, isCapacityNeeded } = require("./helpers");

const errorHandler = (error, req, res) => {
    if (error.code) {
        return res.status(400).json(error);
    }

    console.error("Err", error);

    return res.status(500);
};

const errorWrapper =
    (fn) =>
        (...args) => {
            fn(...args).catch((err) => errorHandler(err, ...args));
        };

const parseFile = (file) => {
    try {
        const sheet = XLSX.read(file.data, { type: "buffer" });
        if (!sheet.Sheets["Import"]) {
            throw {};
        }

        return XLSX.utils.sheet_to_json(sheet.Sheets["Import"]).map((item) => {
            const d = {};

            Object.keys(item).forEach((key) => {
                d[key.trim()] =
                    item[key] && item[key].trim ? item[key].trim() : item[key];
            });

            return d;
        });
    } catch {
        throw { code: "PARSING_ERROR" };
    }
};

const validateData = async (data) => {
    const promises = data.map(validateOrder);

    return Promise.all(promises).then((data) => {
        const errors = data.filter(Boolean);

        if (errors.length > 0) {
            throw { code: "VALIDATE_ERROR", data: errors };
        }
    });
};

const validateOrders = async (req, res, next) => {
    try {
        const file = req.files.xlsx;
        const data = parseFile(file);

        await validateData(data);

        return res.sendStatus(200);
    } catch (err) {
        errorHandler(err, req, res);
    }
};

const importOrder = async (data, user) => {
    const status = STATUSES_HASH[data["Отправить на проработку"]];
    const city = await City.findOne(getCity(data));
    const client = await Client.findOne({ name: data[FIELDS_HASH.client] });
    const clientType = data[FIELDS_HASH.clientType];
    const contact = data[FIELDS_HASH.clientContact];
    const coordinate = data[FIELDS_HASH.coordinates];
    const service = SERVICES_HASH[data[FIELDS_HASH.service]];
    const volume = data[FIELDS_HASH.capacity];
    const ipCount = data[FIELDS_HASH.ips];
    const additionalInfo = data[FIELDS_HASH.additional];
    const cms = data[FIELDS_HASH.cms];
    const relation = data[FIELDS_HASH.relation];

    let deadline = await helper.calculateDeadline(3);

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
            volume: isCapacityNeeded(data) ? volume : undefined,
            ip: isIPNeeded(data) ? ipCount : undefined,
            relation: isRelationNeeded(data) ? relation : undefined,
        },
        date: {
            init: new Date(),
            "cs-gzp-pre":
                status === "gzp-pre" || status === "all-pre"
                    ? deadline
                    : undefined,
            "cs-stop-pre":
                status === "stop-pre" || status === "all-pre"
                    ? deadline
                    : undefined,
        },
        history: [helper.historyGenerator("init", user)],
        tech: {
            mass_upload: true,
        },
    });

    const endStatus = data[FIELDS_HASH.status];

    if (SUPPORTED_END_STATUSES.includes(endStatus)) {
        if (endStatus === "Включено ГЗП") {
            order.gzp = {
                "cost-once": data[FIELDS_HASH.onceCost],
                "cost-monthly": data[FIELDS_HASH.monthlyCost],
                need: true,
                capability: true,
                complete: true,
            };

            order.status = "succes";
            order.deadline = undefined;
            order.history.push(
                helper.historyGenerator("mass-upload-enable", user)
            );
        }

        if (endStatus === "Включено СТОП/VSAT") {
            order.stop = {
                "cost-once": data[FIELDS_HASH.onceCost],
                "cost-monthly": data[FIELDS_HASH.monthlyCost],
                provider: await Provider.findOne(getProvider(data)),
                capability: true,
                complete: true,
            };
            order.deadline = undefined;
            order.status = "succes";
            order.history.push(
                helper.historyGenerator("mass-upload-enable", user)
            );
        }
    }

    return order.save();
};

const importOrders = async (req, res) => {
    const file = req.files.xlsx;
    const data = parseFile(file);

    await validateData(data);

    const orders = [];

    for (const item of data) {
        const order = await importOrder(item, res.locals.__user);
        orders.push(order.id);
    }

    return res.status(200).json({ orders });
};

module.exports = {
    validateOrders: errorWrapper(validateOrders),
    importOrders: errorWrapper(importOrders),
};
