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
            perPage = 20; // TODO брать из конфига?

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
            case 'b2o':
                query = {'$or': [{status: 'stop-build'}, {status: 'stop-pre'}, {status: 'all-pre'}]};
                view = 'mains/stop';
                break;
            case 'net':
                query = {status: 'network'};
                view = 'mains/net';
                break;
            case 'gus':
                if(cities.length == 0) {
                    // TODO: Сделать страницу для ошибок
                    query = {status: 'gzp-pre'};
                    view = 'mains/gus';
                } else {
                    query =
                        {'$or': [{status: 'gzp-pre'}, {status: 'all-pre'}, {status: 'gzp-build'}, {status: 'install-devices'}]},
                        {'$or': cities};
                    view = 'mains/gus';
                }

                break;
            default:
            break;
        }

        var docs = await Order.paginate(query, { page: pageNumber, limit: perPage, populate: 'info.client info.service info.city'});

        if (!docs.docs.length)
        {
            if (pageNumber !== 1) {
                res.redirect(req.path);
            } else {
                render(req, res, {
                    viewName: view
                });
            }
        } else {
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
        }

    },
    init: async (req, res) => {

        var data = req.body;
        if(data['date-request'])
            data['date-request'] = new Date(data['date-request']);
        data.initiator = await Account.findOne({login: res.locals.__user.login});

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
            info: order.info,
            date: {
                init: new Date()
            }
         });

        Order.create(ordr);
        res.send({created: true})
    },

    getOrderInfo: async (req, res) => {
        var order = await Order.findOne({id: req.params.id}).deepPopulate('info.initiator info.initiator.department info.client info.client.type info.service info.city');
        res.locals.order = order;
        res.locals.template = await fields.getInfo(order);

        var actions = await fields.getActions(order, res.locals.__user, 'info');

        render(req, res, {
            viewName: 'orders/order',
            options: {
                tab: 'info',
                actions: actions
            }
        });
    },

    getOrderGZP: async (req, res) => {
        var order = await Order.findOne({id: req.params.id}).deepPopulate('info.initiator info.initiator.department info.client info.client.type info.service info.city');
        res.locals.order = order;

        var access = false;
        if ( (order.status == 'gzp-pre' || order.status == 'all-pre') && (res.locals.__user.department.type == 'gus' && res.locals.__user.department.cities.indexOf(order.info.city._id) >= 0)) {
            access = 'gzp';
        }
        res.locals.template = await fields.getGZP(order, access);

        var actions = await fields.getActions(order, res.locals.__user, 'gzp');

        render(req, res, {
            viewName: 'orders/order',
            options: {
                tab: 'gzp',
                access: access,
                actions: actions
            }
        });
    },

    getOrderSTOP: async (req, res) => {
        var order = await Order.findOne({id: req.params.id}).deepPopulate('info.initiator info.initiator.department info.client info.client.type info.service info.city');
        res.locals.order = order;

        var actions = await fields.getActions(order, res.locals.__user, 'stop');
        var access = false;

        if(order.status == 'all-pre' || order.status == 'stop-pre') {
            if(res.locals.__user.department.type == 'b2o') access = 'stop';
        }
        res.locals.template = await fields.getSTOP(order, access);

        render(req, res, {
            viewName: 'orders/order',
            options: {
                tab: 'stop',
                access: access,
                actions: actions
            }
        });
    },

    getOrderHistory: async (req, res) => {
        var order = await Order.findOne({id: req.params.id}).deepPopulate('info.initiator info.initiator.department info.client info.client.type info.service info.city');
        res.locals.order = order;
        res.locals.template = await fields.getInfo(order);

        render(req, res, {
            viewName: 'orders/order',
            options: {
                tab: 'history'
            }
        });
    },

    endPreGZP: async (req, res) => {

        var order = await Order.findOne({id: req.params.id}).deepPopulate('info.initiator info.initiator.department info.client info.client.type info.service info.city');

        order.gzp = req.body;

        if(order.status == 'gzp-pre') {
            order.status = 'client-match';
            order.date['gzp-pre'] = new Date();
            order.gzp.complete = true;
        }

        if(order.status == 'all-pre') {
            order.status = 'stop-pre';
            order.date['gzp-pre'] = new Date();
            order.gzp.complete = true;
        }

        order.save();
        res.send({created: true})
    },

    endPreSTOP: async (req, res) => {

        var order = await Order.findOne({id: req.params.id}).deepPopulate('info.initiator info.initiator.department info.client info.client.type info.service info.city');

        order.stop = req.body;

        if(order.status == 'stop-pre') {
            order.status = 'client-match';
            order.date['stop-pre'] = new Date();
            order.stop.complete = true;
        }

        if(order.status == 'all-pre') {
            order.status = 'gzp-pre';
            order.date['stop-pre'] = new Date();
            order.stop.complete = true;
        }

        order.save();
        res.send({created: true})
    },

    changeStatus: async (req, res) => {
        var reqData = req.body;
        var order = await Order.findOne({id: req.params.id});

        switch (reqData.to) {
            case 'start-pre-stop':
                order.status = 'stop-pre';
                order.date['client-match'] = new Date();
                break;
            case 'start-pre-gzp':
                order.status = 'gzp-pre';
                order.date['client-match'] = new Date();
                break;
            case 'end-network':
                order.status = 'client-notify';
                order.date['network'] = new Date();
                break;
            case 'end-build':
                order.status = 'network';
                order.date['gzp-build'] = new Date();
                break;
            case 'start-gzp-build':
                if(order.gzp.need) {
                    order.status = 'gzp-build';
                } else {
                    order.status = 'install-devices';
                }
                order.date['client-match'] = new Date();
                break;
            case 'end-install-devices':
                order.status = 'network';
                order.date['gzp-build'] = new Date();
                break;
        }

        order.save()

        res.send(true)

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
