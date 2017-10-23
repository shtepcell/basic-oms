'use strict';
const Order = require('../models/Order');
const Department = require('../models/Department');
const Account = require('../models/Account');
const Client = require('../models/Client');
const Provider = require('../models/Provider');
const Service = require('../models/Service');
const City = require('../models/City');
// const Street = require('../models/Street');
const mkdirp = require('mkdirp-promise');
const fields = require('./fields');
const Holiday = require('../models/Holiday');

var stages = {
    'init': 'Инициация заказа',
    'client-match': 'Согласование с клиентом',
    'client-notify': 'Уведомление клиента',
    'all-pre': 'Проработка по ГЗП и STOP/VSAT',
    'gzp-pre': 'Проработка по ГЗП',
    'gzp-build': 'Организация ГЗП',
    'install-devices': 'Установка оборудования',
    'stop-pre': 'Проработка по STOP/VSAT',
    'stop-build': 'Организация STOP/VSAT',
    'network': 'Настройка сети',
    'succes': 'Включен',
    'reject': 'Заявка отклонена',
    'secret': 'Заявка удалена'
};

var populateQuery = `info.initiator info.initiator.department info.client info.client.type info.service info.city stop.provider history.author history.author.department`;

const Render = require('../render'),
    render = Render.render;

const logger = require('./logger');

module.exports = {

    getPageInit: async (req, res) => {
        if(res.locals.__user.department.type == 'b2b' || res.locals.__user.department.type == 'b2o') {
            res.locals.template = await fields.getInitField();
            res.locals.dataset = await getData();
            render(req, res, {
                viewName: 'orders/init'
            });
        } else {
            render(req, res, { view: '404' });
        }
    },
    getMainPage: async (req, res) => {

        var pagerId = 'first',
            pagers = [],
            pageNumber = req.query['pager' + pagerId] || 1,
            perPage = 20; // IDEA брать из настроек пользователя

        if (!!(+pageNumber) && (+pageNumber) > 0) {
            pageNumber = +pageNumber;
            pagers[0] = pagerId;
        }
        else
            res.redirect(req.path);

        var query;
        var dep = res.locals.__user.department.type;
        var _dep = res.locals.__user.department._id;
        var cities = res.locals.__user.department.cities;
        cities = cities.map( item => {
            return {
                'info.city' : item
            }
        });
        var view = 'main';
        switch (dep) {
            case 'b2b':
                query = {
                    '$and': [
                        {
                            '$or': [
                                {status: 'client-match'},
                                {status: 'client-notify'}
                            ]
                        },
                        {
                            'info.department': _dep
                        }
                    ]
                };

                view = 'mains/b2b';
                break;
            case 'b2o':
                query = {
                    '$or': [
                        {status: 'stop-build'},
                        {status: 'stop-pre'},
                        {status: 'all-pre'},
                        {
                            '$and': [
                                {'info.department': _dep},
                                {'$or': [
                                    {status: 'client-match'},
                                    {status: 'client-notify'}
                                ]}
                            ]
                        }
                    ]
                };
                view = 'mains/stop';
                break;
            case 'net':
                query = {status: 'network'};
                view = 'mains/net';
                break;
            case 'gus':
                if(cities.length == 0) {
                    query = { status: 'lololo' };
                } else {

                    query = {
                        '$and': [
                            {
                                '$or': [
                                    {status: 'gzp-pre'},
                                    {status: 'all-pre'},
                                    {status: 'gzp-build'},
                                    {status: 'install-devices'}
                                ]
                            },
                            {
                                '$or': cities
                            }
                        ]
                    };
                }
                view = 'mains/gus';
                break;
            default:
            break;
        }

        var docs = await Order.paginate(query, { page: pageNumber, limit: perPage, populate: [
            {
                path: 'info.client',
                model: 'Client',
                populate: {
                    path: 'type',
                    model: 'ClientType'
                }
            },
            {
                path: 'info.service',
                model: 'Service'
            },
            {
                path: 'info.city',
                model: 'City'
            }
        ]});
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
            docs.docs.forEach( item => {
                item.status = stages[item.status];
            });
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

        Object.keys(data).forEach( item => {
            data[item] = data[item].trim();
            if(data[item] == '') data[item] = undefined;
        });

        if(data['date-request']) {
            var date = parseDate(data['date-request']);

            if(!date) {
                res.status(400).send({ errText: 'Некорректный формат даты' });
                return;
            }
            data['date-request'] = date;
        }
        data.initiator = await Account.findOne({login: res.locals.__user.login});
        data.department = await Department.findOne({_id: res.locals.__user.department._id + ''});

        var order = {
            status: data.pre,
            info: data
        };

        if(!order.info.client) {
            res.status(400).send({ errText: 'Клиент - обязательное поле!' });
            return;
        }
        var clnt = order.info.client;
        if(clnt == 'err') {
            res.status(400).send({ errText: 'Введите коректное название клиента. Например Apple' });
            return;
        }
        clnt = await Client.findOne({name: clnt});

        if(!clnt) {
            res.status(400).send({ errText: 'Такого клиента не существует.' });
            return;
        }

        order.info.client = clnt;

        var service = await Service.findOne({ _id: order.info.service });
        order.info.service = service;

        if(!order.info.city) {
            res.status(400).send({ errText: 'Город указывать обязательно!' });
            return;
        }
        order.info.city = parserCity(order.info.city);

        if(order.info.city == 'err') {
            res.status(400).send({ errText: 'Формат города неверный! Следует писать так - г./c./пос./пгт. Симферополь' });
            return;
        }
        var tmpCity = await City.find({ type: order.info.city.type, name: order.info.city.name });

        if(tmpCity.length == 0) {
            var ct = new City({
                type: order.info.city.type,
                name: order.info.city.name,
                usage: false
            });
            let dn = await ct.save();
            if (dn) {
                tmpCity[0] = dn;
            } else {
                res.status(400).send({ errText: 'Ошибка создания города! Если вы видете эту ошибку - обратитесь к админисратору' });
                return;
            }
        }

        if(tmpCity.length > 1) {
            res.status(400).send({ errText: 'Городов с похожим названием найдено несколько. Пожалуйста уточните.' });
            return;
        }

        order.info.city = tmpCity[0];
        order.info.pre = undefined;

        var kk = {
            init: new Date()
        };

        switch (order.status) {
            case 'all-pre':
                kk['cs-gzp-pre'] = await calculateDeadline(3);
                kk['cs-stop-pre'] = await calculateDeadline(3);
                break;
            case 'gzp-pre':
                kk['cs-gzp-pre'] = await calculateDeadline(3);
                break;
            case 'stop-pre':
                kk['cs-stop-pre'] = await calculateDeadline(3);
                break;
        }

        var ordr = new Order({
            status: order.status,
            deadline: await calculateDeadline(3),
            info: order.info,
            date: kk,
            history: [
                {
                    name: 'Инициация заявки',
                    date: new Date(),
                    author: data.initiator
                }
            ]
         });

        var done = await Order.create(ordr);
        if(done) {
            service.usage = true;
            service.save();
            clnt.usage = true;
            clnt.save();
            logger.info(`Init Order #${ done.id } | ${ done.status } | ${ done.info.client.name } | ${done.info.city.type} ${done.info.city.name}`, res.locals.__user);
            res.send({created: true})
        } else res.send({errText: 'Что-то пошло не так'});
    },

    getOrderInfo: async (req, res) => {
        var order = await Order.findOne({id: req.params.id, status: {'$ne': 'secret'}}).deepPopulate(populateQuery);

        if(order) {
            order.stage = stages[order.status];
            res.locals.dataset = await getData();

            res.locals.order = order;

            render(req, res, {
                viewName: 'orders/order',
                options: {
                    tab: 'info',
                    admin: (req.query.admin=='1')
                }
            });

        } else render(req, res, { view: '404' });
    },

    getOrderGZP: async (req, res) => {
        var order = await Order.findOne({id: req.params.id, status: {'$ne': 'secret'}}).deepPopulate(populateQuery);

        if(order) {
            order.stage = stages[order.status];
            res.locals.dataset = await getData();

            res.locals.order = order;

            render(req, res, {
                viewName: 'orders/order',
                options: {
                    tab: 'gzp',
                    admin: (req.query.admin=='1')
                }
            });

        } else render(req, res, { view: '404' });
    },

    getOrderSTOP: async (req, res) => {
        var order = await Order.findOne({id: req.params.id, status: {'$ne': 'secret'}}).deepPopulate(populateQuery);
        if(order) {
            order.stage = stages[order.status];
            res.locals.dataset = await getData();

            res.locals.order = order;

            render(req, res, {
                viewName: 'orders/order',
                options: {
                    tab: 'stop',
                    admin: (req.query.admin=='1')
                }
            });

        } else render(req, res, { view: '404' });
    },

    getOrderHistory: async (req, res) => {
        var order = await Order.findOne({id: req.params.id, status: {'$ne': 'secret'}}).deepPopulate(populateQuery);

        if(order) {
            order.stage = stages[order.status];
            res.locals.dataset = await getData();

            res.locals.order = order;
            res.locals.template = await fields.getInfo(order);

            render(req, res, {
                viewName: 'orders/order',
                options: {
                    tab: 'history'
                }
            });

        } else render(req, res, { view: '404' });
    },

    adminEdit: async (req, res) => {
        var data = req.body;

        if(res.locals.__user.department.type != 'admin') {
            res.status(402).send({errText: 'Эта функция доступна только администратору!'});
            return;
        }

        var order = await Order.findOne({id: req.params.id});
        if(!order) {
            res.status(402).send({errText: 'Такой заявки не существует!'});
            return;
        }

        Object.keys(data).forEach( item => {
            data[item] = data[item].trim();
            if(data[item] == '') data[item] = undefined;
        });

        switch (req.params.tab) {
            case 'info':
                var tmp = {};


                if(data['date-request']) {
                    var date = parseDate(data['date-request']);

                    if(!date) {
                        res.status(400).send({ errText: 'Некорректный формат даты' });
                        return;
                    }
                    data['date-request'] = date;
                }

                tmp = data;

                if(!data.client) {
                    res.status(400).send({ errText: 'Клиент - обязательное поле!' });
                    return;
                }
                var clnt = data.client;
                if(clnt == 'err') {
                    res.status(400).send({ errText: 'Введите коректное название клиента. Например Apple' });
                    return;
                }
                clnt = await Client.findOne({name: clnt});

                if(!clnt) {
                    res.status(400).send({ errText: 'Такого клиента не существует.' });
                    return;
                }

                tmp.client = clnt;

                var service = await Service.findOne({ _id: data.service });
                tmp.service = service;

                if(!data.city) {
                    res.status(400).send({ errText: 'Город указывать обязательно!' });
                    return;
                }
                data.city = parserCity(data.city);

                if(data.city == 'err') {
                    res.status(400).send({ errText: 'Формат города неверный! Следует писать так - г./c./пос./пгт. Симферополь' });
                    return;
                }
                var tmpCity = await City.find({ type: data.city.type, name: data.city.name });

                if(tmpCity.length == 0) {
                    var ct = new City({
                        type: data.city.type,
                        name: data.city.name,
                        usage: false
                    });
                    let dn = await ct.save();
                    if (dn) {
                        tmpCity[0] = dn;
                    } else {
                        res.status(400).send({ errText: 'Ошибка создания города! Если вы видете эту ошибку - обратитесь к админисратору' });
                        return;
                    }
                }

                if(tmpCity.length > 1) {
                    res.status(400).send({ errText: 'Городов с похожим названием найдено несколько. Пожалуйста уточните.' });
                    return;
                }

                tmp.city = tmpCity[0];

                if(data['date-sign']) {
                    var date = parseDate(data['date-sign'])
                    if(date == 'err') {
                        res.status(400).send({errText: 'Неверный формат даты'})
                        return;
                    }
                    tmp['date-sign'] = date;
                }

                if(req.files.order) {
                    var id = order.id;
                    var _dir;
                    for (var i = 0; i < 1000; i++) {
                        if(id > i*1000) {
                            _dir = `${(i)*1000}-${(i+1)*1000}`;
                        }
                    }
                    var dir = await mkdirp(`./static/files/${_dir}/${order.id}`);
                    req.files.order.mv(`./static/files/${_dir}/${order.id}/${req.files.order.name}`, function(err) {
                        if (err) {
                            logger.error(err);
                            return res.status(500).send(err);
                        }
                    });
                    order.info.order = `${req.files.order.name}`;

                }
                order.info = Object.assign(order.info, tmp);
                break;

            case 'gzp':

                if(isNaN(data.time)) {
                    res.status(400).send({ errText: 'Срок организации должен быть числом' });
                    return;
                }

                order.gzp = Object.assign(order.gzp, data);
                break;

            case 'stop':

                if(isNaN(data.time)) {
                    res.status(400).send({errText: 'Срок организации должен быть числом'});
                    return;
                }

                if(!data.provider) {
                    res.status(400).send({errText: 'Провайдер - обязательное поле!'});
                    return;
                }

                var prvdr = parseClient(data.provider);

                var provider = await Provider.findOne({type: prvdr.type, name: prvdr.name});

                if(!provider) {
                    res.status(400).send({errText : 'Такого провайдера не существует!'});
                    return;
                }
                data.provider = provider;
                order.stop = Object.assign(order.stop, data);
                break;
        }
        order.history.push({
            name: 'Административная правка',
            date: new Date(),
            author: await Account.findOne({_id: res.locals.__user._id})
        });

        var done = await order.save();
        if(done) {
            res.status(200).send({created: true});
            return;
        } else {
            res.status(400).send({errText: 'Неизвестная ошибка!'});
            return;
        }
    },

    endPreGZP: async (req, res) => {
        var order = await Order.findOne({id: req.params.id}).deepPopulate(populateQuery);
        if(order) {
            Object.keys(req.body).forEach( item => {
                req.body[item] = req.body[item].trim();
                if(req.body[item] == '') req.body[item] = undefined;
            });
            if(isNaN(req.body.time)) {
                res.status(400).send({ errText: 'Срок организации должен быть числом' });
                return;
            }
            order.gzp = req.body;

            if(order.status == 'gzp-pre') {
                order.status = 'client-match';
                order.deadline = await calculateDeadline(10);
                order.date['gzp-pre'] = new Date();
                order.date['cs-client-match'] = await calculateDeadline(10);
                order.gzp.complete = true;
            }

            if(order.status == 'all-pre') {
                order.status = 'stop-pre';
                order.date['gzp-pre'] = new Date();
                order.gzp.complete = true;
            }
            order.history.push({
                name: 'Завершена проработка ГЗП',
                date: new Date(),
                author: await Account.findOne({_id: res.locals.__user._id})
            });
            var done = await order.save();
            if(done) {
                logger.info(`End pre-gzp order #${ done.id }`, res.locals.__user);
                res.status(200).send({created: true})
            } else res.status(400).send({errText: 'Что-то пошло не так!'});
        } else res.status(404);
    },

    endPreSTOP: async (req, res) => {
        var order = await Order.findOne({id: req.params.id}).deepPopulate(populateQuery);
        if(order) {
            Object.keys(req.body).forEach( item => {
                req.body[item] = req.body[item].trim();
                if(req.body[item] == '') req.body[item] = undefined;
            });

            if(isNaN(req.body.time)) {
                res.status(400).send({errText: 'Срок организации должен быть числом'});
                return;
            }

            if(!req.body.provider) {
                res.status(400).send({errText: 'Провайдер - обязательное поле!'});
                return;
            }

            order.stop = req.body;
            var prvdr = parseClient(req.body.provider);

            var provider = await Provider.findOne({type: prvdr.type, name: prvdr.name});

            if(!provider) {
                res.status(400).send({errText : 'Такого провайдера не существует!'});
                return;
            }

            order.stop.provider = provider;

            if(order.status == 'stop-pre') {
                order.status = 'client-match';
                order.deadline = await calculateDeadline(10);
                order.date['cs-client-match'] = await calculateDeadline(10);
                order.date['stop-pre'] = new Date();
                order.stop.complete = true;
            }

            if(order.status == 'all-pre') {
                order.status = 'gzp-pre';
                order.date['stop-pre'] = new Date();
                order.stop.complete = true;
            }
            order.history.push({
                name: 'Завершена проработка STOP/VSAT',
                date: new Date(),
                author: await Account.findOne({_id: res.locals.__user._id})
            });
            var done = await order.save();
            if(done) {
                provider.usage = true;
                provider.save();
                logger.info(`End pre-stop order #${ done.id }`, res.locals.__user);
                res.status(200).send({created: true});
            } else res.status(400).send({errText: 'Что-то пошло не так!'})
        } else res.status(404);
    },

    endClientNotify: async (req, res) => {
        var reqData = req.body;
        var order = await Order.findOne({id: req.params.id});

        if(!order) {
            res.status(400).send({errText: 'Ошибка при сохранении!'});
            return;
        }

        if(order.status == 'client-notify') {
            var id = order.id;
            var _dir;
            for (var i = 0; i < 1000; i++) {
                if(id > i*1000) {
                    _dir = `${(i)*1000}-${(i+1)*1000}`;
                }
            }
            if(!req.files.order) {
                res.status(400).send({errText: 'Договор - обязателен!'})
                return;
            }
            if(!reqData['date-sign']) {
                res.status(400).send({errText: 'Дата подписания - обязательна!'})
                return;
            }
            var date = parseDate(reqData['date-sign'])
            if(!date) {
                res.status(400).send({errText: 'Неверный формат даты'})
                return;
            }
            var dir = await mkdirp(`./static/files/${_dir}/${order.id}`);
            req.files.order.mv(`./static/files/${_dir}/${order.id}/${req.files.order.name}`, function(err) {
                if (err) {
                    logger.error(err);
                    return res.status(500).send(err);
                }
            });

            order.info['date-sign'] = date;
            order.info.order = `${req.files.order.name}`;
            order.status = 'succes';
            order.date['client-notify'] = new Date();
            order.deadline = undefined;

            order.history.push({
                name: 'Завершено уведомление клиента. Абонент включен.',
                date: new Date(),
                author: await Account.findOne({_id: res.locals.__user._id})
            });

            var done = await order.save();
            if(done) {
                logger.info(`End client-notify order #${ done.id }`, res.locals.__user);
                res.status(200).send({created: true});
            } else res.status(400).send({errText: 'Что-то пошло не так'})
        }
    },

    getFile: async (req, res) => {
        var order = await Order.findOne({id: req.params.id});

        if(order) {
            var id = order.id;
            var _dir;
            for (var i = 0; i < 1000; i++) {
                if(id > i*1000) {
                    _dir = `${(i)*1000}-${(i+1)*1000}`;
                }
            }
            var filePath = `./static/files/${_dir}/${order.id}/${req.params.file}`;
            var options = {
                root: './',
                dotfiles: 'deny',
                headers: {
                   'x-timestamp': Date.now(),
                   'x-sent': true
               }
            }
            res.sendFile(filePath, options);
        }
    },

    changeStatus: async (req, res) => {
        var reqData = req.body;
        var order = await Order.findOne({id: req.params.id, status: {'$ne': 'secret'}});

        if(!order) {
            res.status(400).send({errText: 'Изменение несуществующей заявки!'});
            return;
        }
        switch (reqData.to) {
            case 'pause':
                order.pause = {
                    status: true,
                    date: new Date(),
                    deadline: Math.round((order.deadline - new Date()) / 1000 / 60 / 60 / 24)
                };
                order.history.push({
                    name: 'Постановка на паузу',
                    date: new Date(),
                    author: await Account.findOne({_id: res.locals.__user._id})
                });
                break;
            case 'stop-pause':
                var start = order.pause.date;
                var now = new Date();
                var delta = Math.round((now - start) / 1000 / 60 / 60 / 24);
                order.deadline = new Date(order.deadline.getFullYear(), order.deadline.getMonth(), order.deadline.getDate() + delta);
                order.pause = {
                    status: false,
                    date: undefined
                };
                order.history.push({
                    name: 'Снятие с паузы',
                    date: new Date(),
                    author: await Account.findOne({_id: res.locals.__user._id})
                });
                break;
            case 'delete':
                order.status = 'secret';
                order.deadline = null;
                order.history.push({
                    name: 'Заявка удалена',
                    date: new Date(),
                    author: await Account.findOne({_id: res.locals.__user._id})
                });
                break;
            case 'reject':
                order.status = 'reject';
                order.deadline = null;
                order.history.push({
                    name: 'Заявка отклонена',
                    date: new Date(),
                    author: await Account.findOne({_id: res.locals.__user._id})
                });
                break;
            case 'start-pre-stop':
                order.status = 'stop-pre';
                order.deadline = await calculateDeadline(3);
                order.date['cs-stop-pre'] = await calculateDeadline(3);
                order.date['client-match'] = new Date();
                order.history.push({
                    name: 'Начало проработки STOP/VSAT',
                    date: new Date(),
                    author: await Account.findOne({_id: res.locals.__user._id})
                });
                break;
            case 'start-pre-gzp':
                order.status = 'gzp-pre';
                order.deadline = await calculateDeadline(3);
                order.date['cs-gzp-pre'] = await calculateDeadline(3);
                order.date['client-match'] = new Date();
                order.history.push({
                    name: 'Начало проработки ГЗП',
                    date: new Date(),
                    author: await Account.findOne({_id: res.locals.__user._id})
                });
                break;
            case 'end-network':
                order.status = 'client-notify';
                order.deadline = await calculateDeadline(2);
                order.date['cs-client-notify'] = await calculateDeadline(2);
                order.date['network'] = new Date();
                order.history.push({
                    name: 'Выполнена настройка сети',
                    date: new Date(),
                    author: await Account.findOne({_id: res.locals.__user._id})
                });
                break;
            case 'end-build':
                order.status = 'network';
                order.date['gzp-build'] = new Date();
                order.history.push({
                    name: 'Строительство ГЗП завершено',
                    date: new Date(),
                    author: await Account.findOne({_id: res.locals.__user._id})
                });
                break;
            case 'start-gzp-build':
                if(order.gzp.need) {
                    order.status = 'gzp-build';
                } else {
                    order.status = 'install-devices';
                }
                order.deadline = await calculateDeadline(order.gzp.time);
                order.date['cs-gzp-organization'] = await calculateDeadline(order.gzp.time + 2);
                order.date['client-match'] = new Date();
                order.history.push({
                    name: 'Начало строительства ГЗП',
                    date: new Date(),
                    author: await Account.findOne({_id: res.locals.__user._id})
                });
                break;
            case 'end-install-devices':
                order.status = 'network';
                order.date['gzp-build'] = new Date();
                order.history.push({
                    name: 'Установлено оборудование',
                    date: new Date(),
                    author: await Account.findOne({_id: res.locals.__user._id})
                });
                break;
            case 'start-stop-build':
                order.status = 'stop-build';
                order.deadline = await calculateDeadline(order.stop.time);
                order.date['cs-stop-organization'] = await calculateDeadline(order.stop.time + 2);
                order.date['client-match'] = new Date();
                order.history.push({
                    name: 'Начало организации через STOP/VSAT',
                    date: new Date(),
                    author: await Account.findOne({_id: res.locals.__user._id})
                });
                break;
            case 'end-build-stop':
                order.status = 'network';
                order.date['stop-build'] = new Date();
                order.history.push({
                    name: 'Завершена организация через STOP/VSAT',
                    date: new Date(),
                    author: await Account.findOne({_id: res.locals.__user._id})
                });
                break;
        }

        var done = await order.save();
        if(done) {
            logger.info(`${reqData.to} order #${done.id}`, res.locals.__user);
            res.status(200).send({created: true});
        } else res.status(400).send({errText: 'Изменение несуществующей заявки!'});

    },

    getStat: async (req, res) => {
        var deps = await Department.find();
        var orders = await Order.find({status: {'$ne': 'secret'}}).populate('info.initiator');

        orders = orders.map( item => {
            var wrkr;

            switch (item.status) {
                case 'gzp-pre':
                    deps.forEach( i => {
                        if(i.type == 'gus') {
                            if(i.cities.indexOf(item.info.city) >= 0) {
                                item.worker = i;
                                return;
                            }
                        }
                    })
                    break;
                case 'stop-pre':
                    deps.forEach( i => {
                        if(i.type == 'b2o') {
                            item.worker = i;
                        }
                    })
                    break;
                case 'all-pre':
                    item.worker = [];
                    deps.forEach( i => {
                        if(i.type == 'gus') {
                            if(i.cities.indexOf(item.info.city) >= 0) {
                                item.worker.push(i);
                                return;
                            }
                        }
                        if(i.type == 'b2o') {
                            item.worker.push(i);
                        }
                    })
                    break;
                case 'client-notify':
                    deps.forEach( i => {
                        if(item.info.initiator.department == ''+i._id) {
                            item.worker = i;
                            return;
                        }
                    })
                    break;

                case 'client-match':
                    deps.forEach( i => {
                        if(item.info.initiator.department ==''+i._id) {
                            item.worker = i;
                            return;
                        }
                    })
                    break;

                case 'network':
                    deps.forEach( i => {
                        if(i.type == 'net') {
                            item.worker = i;
                            return;
                        }
                    })
                    break;

                case 'gzp-build':
                    deps.forEach( i => {
                        if(i.type == 'gus') {
                            if(i.cities.indexOf(item.info.city) >= 0) {
                                item.worker = i;
                                return;
                            }
                        }
                    })
                    break;

                case 'install-devices':
                    deps.forEach( i => {
                        if(i.type == 'gus') {
                            if(i.cities.indexOf(item.info.city) >= 0) {
                                item.worker = i;
                                return;
                            }
                        }
                    })
                    break;

                case 'stop-build':
                    deps.forEach( i => {
                        if(i.type == 'b2o') {
                            item.worker = i;
                            return;
                        }
                    });
                    break;

            }
            return {
                status: item.status,
                pause: item.pause,
                worker: item.worker,
                deadline: item.deadline
            }
        });

        var stages = {
            pre: {
                all: 0,
                bad: 0
            },
            build: {
                all: 0,
                bad: 0
            },
            succes: {
                all: 0
            },
            reject: {
                all: 0
            }
        };

        var dprtmts = {};

        orders.forEach( item => {
            var pre = ['gzp-pre', 'stop-pre', 'all-pre', 'client-match'];
            var build = ['gzp-build', 'stop-build', 'install-devices', 'client-notify', 'network'];

            if(pre.indexOf(item.status) >= 0) {
                stages.pre.all++;
                if(item.deadline < new Date()) stages.pre.bad++;
            }

            if(build.indexOf(item.status) >= 0) {
                stages.build.all++;
                if(item.deadline < new Date()) stages.build.bad++;
            }
            if(item.worker) {
                if(item.worker.length) {
                    item.worker.forEach( i => {
                        if(!dprtmts[i._id]) {
                            dprtmts[i._id] = {
                                pre: {
                                    all: 0,
                                    bad: 0
                                },
                                build: {
                                    all: 0,
                                    bad: 0
                                }
                            }
                        }
                        if(pre.indexOf(item.status) >= 0) {
                            dprtmts[i._id].pre.all++;
                            if(item.deadline < new Date()) dprtmts[i._id].pre.bad++;
                        }

                    })

                } else {
                    if(!dprtmts[item.worker._id])
                        dprtmts[item.worker._id] = {
                            pre: {
                                all: 0,
                                bad: 0
                            },
                            build: {
                                all: 0,
                                bad: 0
                            }
                        }
                    if(pre.indexOf(item.status) >= 0) {
                        dprtmts[item.worker._id].pre.all++;
                        if(item.deadline < new Date()) dprtmts[item.worker._id].pre.bad++;
                    }

                    if(build.indexOf(item.status) >= 0) {
                        dprtmts[item.worker._id].build.all++;
                        if(item.deadline < new Date()) dprtmts[item.worker._id].build.bad++;
                    }
                }

            }

            if(item.status == 'succes') stages.succes.all++;
            if(item.status == 'reject') stages.reject.all++;

        })
        res.locals.deps = deps;
        res.locals.statistics = {
            all: orders.length,
            stages: stages,
            deps : dprtmts
        };
        render(req, res, {
            viewName: 'status'
        });
    },

    searchReset: async (req, res) => {
        var usr = await Account.findOne({_id: res.locals.__user._id});
        usr.settings.search.query = '/search';
        var done = await usr.save();
        if(done) {
            res.redirect('/search');
            return;
        } else return;
    },

    search: async (req, res) => {
        res.locals.data = await getData();
        res.locals.err = {};

        if(req.query.func && req.query.func.length == 1)  req.query.func = [req.query.func]
        if(req.query.pre && req.query.pre.length == 1)  req.query.pre = [req.query.pre]
        if(req.query.build && req.query.build.length == 1)  req.query.build = [req.query.build]
        if(req.query.final && req.query.final.length == 1)  req.query.final = [req.query.final]

        var usr = await Account.findOne({_id: res.locals.__user._id});

        if(Object.keys(req.query).length == 0) {
            if( usr.settings.search.query && usr.settings.search.query != req.originalUrl ) {
                res.redirect(usr.settings.search.query);
                return;
            }
        }

        usr.settings.search.query = req.originalUrl;
        res.locals.query = req.query;
        usr.save();

        if(req.query.id && isNaN(req.query.id)) {
            res.locals.err.id = 'ID должен быть числом';
        }
        var query = await makeQuery(req, res);
        query.special = undefined;
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

        var docs = await Order.paginate(query, { page: pageNumber, limit: perPage, populate: [
            {
                path: 'info.client',
                model: 'Client',
                populate: {
                    path: 'type',
                    model: 'ClientType'
                }
            },
            {
                path: 'info.service',
                model: 'Service'
            },
            {
                path: 'info.city',
                model: 'City'
            }
        ]});

        docs.docs.forEach( item => {
            item.status = stages[item.status];
        });

        res.locals.pagers = {};
        res.locals.pagers[pagerId] = {
            pageNumber: +pageNumber,
            records: docs.total,
            perPage: docs.limit
        };

        res.locals.orders = docs.docs;

        render(req, res, {
            viewName: 'search',
            options: {
                pagers: pagers
            }
        });
    }
}

function parseClient(str) {
    var res = { type: '', name: ''};
    for (var i = 1; i < str.length; i++) {
        if(str[i] === ']') {
            res.name = str.slice(i+2, str.length);
            return res;
        } else res.type += ''+str[i];
    }
    return 'err';
}

function parserCity(str) {
    var res = { type: '', name: ''};
    var types = ['г.', 'с.', 'пгт.', 'пос.'];

    for (var i = 0; i < str.length; i++) {
        if(str[i] === '.') {
            res.type += '.';
            res.name = str.slice(i+2, str.length);
            if (res.name.length <= 0 || types.indexOf(res.type) < 0) {
                return 'err';
            }
            return res;
        } else res.type += ''+str[i];
    }
    return 'err';
}

var makeQuery = async (req, res) => {
    var qr = {status: {'$ne': 'secret'}};
    var query = req.query;
    var status = [];
    if(query.id) {
        return {id: query.id};
    }
    if(query.cms) {
        return {cms: query.cms};
    }
    if(query.func) {
        if(query.func.indexOf('1') >= 0) {
            qr['$or'] = [
                {'info.initiator': res.locals.__user._id},
                {'history.author': res.locals.__user._id}
            ]
        }
        if(query.func.indexOf('2') >= 0) {
            qr['deadline'] = {'$lte': new Date()};
        }
        if(query.func.indexOf('3') >= 0) {
            qr['pause.status'] = true;
        }
    }
    if(query.pre) {
        if(query.pre.indexOf('1') >= 0) {
            status.push({status: 'gzp-pre'});
            status.push({status: 'all-pre'});
        }
        if(query.pre.indexOf('2') >= 0) {
            status.push({status: 'stop-pre'});
            if(status.indexOf({status: 'all-pre'}) < 0) {
                status.push({status: 'all-pre'});
            }
        }
        if(query.pre.indexOf('3') >= 0) {
            status.push({status: 'client-match'});
        }
    }
    if(query.build) {
        if(query.build.indexOf('1') >= 0) {
            status.push({status: 'gzp-build'});
        }
        if(query.build.indexOf('2') >= 0) {
            status.push({status: 'install-devices'});
        }
        if(query.build.indexOf('3') >= 0) {
            status.push({status: 'stop-build'});
        }
        if(query.build.indexOf('4') >= 0) {
            status.push({status: 'network'});
        }
        if(query.build.indexOf('5') >= 0) {
            status.push({status: 'client-notify'});
        }
    }

    if(query.final) {
        if(query.final.indexOf('1') >= 0) {
            status.push({ '$and' : [
                {status: 'succes'},
                {'date.gzp-build': {$ne:null}}
            ]});
        }
        if(query.final.indexOf('2') >= 0) {
            status.push({ '$and' : [
                {status: 'succes'},
                {'date.stop-build': {$ne:null} }
            ]});
        }
        if(query.final.indexOf('3') >= 0) {
            status.push({status: 'reject'});
        }
    }

    if(status.length > 0) {
        if(qr['$or']) {
            qr['$or'] = qr['$or'].concat(status);
        } else
            qr['$or'] = status;
    }

    if(query.client) {
        var clnt = query.client;
        clnt = clnt.trim();
        var rgx =  new RegExp('' + clnt + '', 'i');
        clnt = await Client.find({name: {$regex: rgx}});
        if(clnt.length > 0) {
            var _q = [];
            clnt.forEach( itm => {
                _q.push({'info.client': itm._id});
            })
            qr['$and'] = [{'$or': _q}];
        } else {
            qr['$and'] = [{'asdasd': 'asdasdasd'}]
        }
    }

    if(query.city) {
        // var city = parserCity(query.city);
        var city = query.city;
        city = city.trim();
        var rgx =  new RegExp('' + city + '', 'i');
        city = await City.find({name: {$regex: rgx}});
        if(city.length > 0) {
            var _q = [];
            city.forEach( itm => {
                _q.push({'info.city': itm._id});
            })
            if(qr['$and']) {
                qr['$and'].push({'$or': _q})
            } else qr['$and'] = [{'$or': _q}];
        } else {
            qr['$and'] = [{'asdasd': 'asdasdasd'}]
        }
    }

    if(query.service) {
        var service = await Service.findOne({name: query.service});
        if(qr['$and']) {
            qr['$and'].push({'info.service': service._id})
        } else qr['$and'] = [{'info.service': service._id}];
    }
    return qr;
}

function parseDate (date) {
    date = date.split('.');
    if(date.length == 3) {
        if(date[1] >= 0 && date[1] <= 11 && date[0] > 0 &&  date[0] <= 31)
            return new Date(date[2], date[1]-1, date[0]);
        else return false
    } else return false;
}

var getData = async () => {
    var clients = await Client.find().populate('type');
    var providers = await Provider.find();
    var cities = await City.find();
    var services = await Service.find();


    clients = clients.map( i => `${i.name}`);

    providers = providers.map( i => `[${i.type}] ${i.name}`);

    cities = cities.map( i => `${i.type} ${i.name}`);

    services = services.map( i => {
        return {
            val: `${i._id}`,
            text: `${i.name}`
        }
    });

    var pre = [
        {
            text: 'только ГЗП',
            val: 'gzp-pre'
        },
        {
            text: 'только STOP/VSAT',
            val: 'stop-pre'
        },
        {
            text: 'Одновременно ГЗП и STOP/VSAT',
            val: 'all-pre'
        }
    ];

    return {
        clients: clients,
        providers: providers,
        cities: cities,
        services: services,
        pre: pre
    }

}

var calculateDeadline = async (time) => {
    var holidays = await Holiday.find();
    var now = new Date();

    var i = 0;

    while (time > 0) {
        var day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
        var holi = await Holiday.findOne({date: day});

        if(day.getDay() != 6 && day.getDay() != 0 && holi == null) {
            time--;
        }
        i++;
    }
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, 0, 0, 0, 0);
}
