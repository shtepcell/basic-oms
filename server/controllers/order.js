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

var stages = {
    'init': 'Инициация заказа',
    'client-match': 'Согласование с клиентом',
    'client-notify': 'Уведомление клиента',
    'all-pre': 'Проработка по ГЗП/STOP',
    'gzp-pre': 'Проработка по ГЗП',
    'gzp-build': 'Организация ГЗП',
    'install-devices': 'Установка оборудования',
    'stop-pre': 'Проработка по STOP/VSAT',
    'stop-build': 'Организация STOP/VSAT',
    'network': 'Настройка сети',
    'succes': 'Завершение обработки',
    'reject': 'Отклонение'
};

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
    getMainPage: async (req, res) => {

        var pagerId = 'first',
            pagers = [],
            pageNumber = req.query['pager' + pagerId] || 1,
            perPage = 1; // TODO брать из конфига?

        if (!!(+pageNumber) && (+pageNumber) > 0) {
            pageNumber = +pageNumber;
            pagers[0] = pagerId;
        }
        else
            res.redirect(req.path);

        var query;
        var dep = res.locals.__user.department.type;
        var cities = res.locals.__user.department.cities;
        cities = cities.map( item => {
            return {
                'info.city' : item
            }
        });
        var view = 'main';
        switch (dep) {
            case 'b2b':
                query = {'$or': [{status: 'client-match'}, {status: 'client-notify'}]};
                view = 'mains/b2b';
                break;
            case 'gus':
                if(cities.length == 0) {
                    // TODO: Сделать страницу для ошибок
                    query = {status: 'gzp-pre'};
                    view = 'mains/gus';
                } else {
                    query = {status: 'gzp-pre', '$or': cities};
                    view = 'mains/gus';
                }

                break;
            default:
            break;
        }

        var docs = await Order.paginate(query, { page: pageNumber, limit: perPage, populate: 'info.client info.service info.city'});

        res.locals.pagers = {};
        res.locals.pagers[pagerId] = {
            pageNumber: +pageNumber,
            records: docs.total,
            perPage: docs.limit
        };

        res.locals.orders = docs.docs;
        render(req, res, {
            viewName: view,
            options: {
                pagers: pagers
            }
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
    },
    search: async (req, res) => {

        render(req, res, {
            viewName: 'search'
        });
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
