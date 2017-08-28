'use strict';
const Order = require('../models/Order');
const Department = require('../models/Department');
const Account = require('../models/Account');
const Client = require('../models/Client');
const Provider = require('../models/Provider');
const Service = require('../models/Service');
const City = require('../models/City');
// const Street = require('../models/Street');

const fields = require('./fields');

var stages = [
    'init',
    'client-match',
    'client-notify',
    'all-pre',
    'gzp-pre',
    'gzp-build',
    'install-devices',
    'stop-pre',
    'stop-build',
    'network',
    'succes',
    'reject'
];

const Render = require('../render'),
    render = Render.render;

const logger = require('./logger');

module.exports = {

    getPageInit: async (req, res) => {
        res.locals.services = await Service.find();
        res.locals.template = await fields.getInitField();

        render(req, res, {
            viewName: 'orders/init'
        });
    },

    init: async (req, res) => {

        var data = req.body;

        // data['date-request'] TODO: TO DATE FORMAT

        var order = {
            status: data.pre,
            info: data
        };

        var clnt = parseClient(order.info.client);
        if(clnt == 'err') {
            res.status(400).send({ errText: 'Введите коректное название клиента. Например [QW] Qwerty' });
            return;
        }
        clnt = await Client.find({ name: clnt.name }); //TODO: Find by type too

        if(clnt.length == 0) {
            res.status(400).send({ errText: 'Такого клиента не существует.' });
            return;
        }

        if(clnt.length > 1) {
            res.status(400).send({ errText: 'Клиентов с похожим названием найдено несколько. Пожалуйста уточните.' });
            return;
        }

        order.info.client = clnt[0];

        order.info.service = await Service.findOne({ _id: order.info.service });

        var tmpCity = await City.find({ name: order.info.city });

        if(tmpCity.length == 0) {
            res.status(400).send({ errText: 'Такого города не существует.' });
            return;
        }

        if(tmpCity.length > 1) {
            res.status(400).send({ errText: 'Городов с похожим названием найдено несколько. Пожалуйста уточните.' });
            return;
        }

        order.info.city = tmpCity[0];
        order.info.pre = undefined;

        var ordr = new Order({
            status: order.status,
            info: order.info
         });

        Order.create(ordr);
        res.send({created: true})
    }
};

function parseClient(str) {
    var res = { type: '', name: ''};
    for (var i = 0; i < str.length; i++) {
        if(str[i] === ']') {
            res.name = str.slice(i+2, str.length);
            return res;
        } else res.type += ''+str[i];
    }
    return 'err';
}
