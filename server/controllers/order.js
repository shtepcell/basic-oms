'use strict';
const Order = require('../models/Order');
const Department = require('../models/Department');
const Account = require('../models/Account');
const Client = require('../models/Client');
const Provider = require('../models/Provider');
const City = require('../models/City');
const Street = require('../models/Street');
const mkdirp = require('mkdirp-promise');
const Holiday = require('../models/Holiday');
const Notify = require('../models/Notify');
const { sendMail } = require('./mailer');
const { getExcel } = require('./export');

const helper = require('./helper');
const validator = require('./validator');

var stages = require('../common-data').stages;

var populateQuery = `info.initiator info.initiator.department info.client info.client.type info.city info.street stop.provider history.author history.author.department`;
var shortPop = 'info.client.type info.city info.street';

var populateAll = [
    populateClient,
    populateInitiator,
    populateCity,
    populateStreet,
    populateProvider
];

var populateClient = {
    path: 'info.client',
    select: 'name type',
    populate: {
        path: 'type',
        select: 'shortName name'
    },
    options: {
        lean: true
    }
}

var populateProvider = {
    path: 'stop.provider',
    select: 'name type',
    options: {
        lean: true
    }
}

var populateInitiator = {
    path: 'info.initiator',
    select: 'name department',
    options: {
        lean: true
    }
};

var populateCity = {
    path: 'info.city',
    select: 'name type',
    options: {
        lean: true
    }
}

var populateStreet = {
    path: 'info.street',
    select: 'name type',
    options: {
        lean: true
    }
}
const Render = require('../render'),
    render = Render.render;

const logger = require('./logger');

module.exports = {

    getPageInit: async (req, res) => {
        if(res.locals.__user.department.type == 'b2b' || res.locals.__user.department.type == 'b2o') {
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
            perPage = res.locals.__user.settings.table.perPage || 25;
        res.locals.params = helper.trimObject(req.query);
        
        if(res.locals.params.id && isNaN(res.locals.params.id)) {
            res.locals.params.id_error = true;
        }

        if (!!(+pageNumber) && (+pageNumber) > 0) {
            pageNumber = +pageNumber;
            pagers[0] = pagerId;
        }
        else
            res.redirect(req.path);

        var query;
        var subQ = await helper.makeQuery(req, res);

        var settings = res.locals.__user.settings.main,
            user = res.locals.__user;

        query = {
            stage: {},
            zone: {}
        };
        settings.zone = settings.zone || [];
        settings.stage = settings.stage || [];


        for (var i = 0; i < settings.zone.length; i++) {
            var dep = await Department.findOne({_id: settings.zone[i]});

            dep.cities.forEach( item => {
                if(!query.zone['$or'])
                    query.zone['$or'] = [];
                query.zone['$or'].push({
                    'info.city': item
                });
            })

        }

        if(settings.zone.length > 0 && !query.zone['$or'])
            query.zone['$or'] = [{
                'some': 'bullshit'
            }]

        if(settings.stage.length>0)
            query.stage['$or'] = [];

        settings.stage.forEach( item => {
            if( (user.department.type  == 'b2b' || user.department.type == 'b2o')
                    && (item == 'client-notify' || item == 'client-match') ) {
                query.stage['$or'].push({
                    '$and': [
                        {'status': item},
                        {'info.department': user.department._id}
                    ]
                })
            } else {
                query.stage['$or'].push({
                    'status': item
                })
            }
        });

        var view = 'main';

        var orders = await Order.find({
            $or: [
                { $and: [query.zone, query.stage, subQ] }
            ],
            status: {$ne: 'secret'}
        }).populate([populateClient, populateCity, populateStreet]).lean();

        var total = orders.length;

        if(req.query.sort)
            orders = helper.orderSort(orders, req.query.sort, req.query.value);

        orders = orders.slice((pageNumber - 1)*perPage, (pageNumber - 1)*perPage + perPage);

        orders.forEach( item => {
            item.status = stages[item.status];
        });

        if (!orders.length)
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
                records: total,
                perPage: perPage
            };

            res.locals.orders = orders;
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

        data.initiator = await Account.findOne({login: res.locals.__user.login});
        data.department = await Department.findOne({_id: res.locals.__user.department._id + ''});

        var order = {
            status: data.pre,
            info: data
        };

        var clnt = await validator.client(order.info.client);
        if(!clnt._id) {
            res.status(400).send({ errText: clnt });
            return;
        }
        order.info.client = clnt;

        if(!order.info.contact) {
            res.status(400).send({ errText: 'Укажите контактные данные клиента!' });
            return;
        }

        var city = await validator.city(order.info.city);
        if(!city._id) {
            res.status(400).send({ errText: city });
            return;
        }
        order.info.city = city;

        switch (req.body.adressType) {
            case 'location':
                var strt = await validator.street(order.info.street);
                if(!strt._id) {
                    res.status(400).send({ errText: strt });
                    return;
                }
                order.info.street = strt;

                if(!order.info.adds) {
                    res.status(400).send({ errText: 'Уточните адрес!' });
                    return;
                }
                break;
            case 'coordination':
                if(!order.info.coordinate) {
                    res.status(400).send({ errText: 'Укажите координаты!' });
                    return;
                }
                break;
        }

        if(!order.info.service) {
            res.status(400).send({ errText: 'Выберите услугу' });
            return;
        }

        // TODO: Если услуга требует связанные заказы - проверить наличие

        order.info.pre = undefined;
        order.info.adressType = undefined;

        var kk = {
            init: new Date()
        };

        if(order.info.service == 'sks') order.status = 'sks-pre';

        var deadline = await helper.calculateDeadline(3);
        switch (order.status) {
            case 'all-pre':
                kk['cs-gzp-pre'] = deadline;
                kk['cs-stop-pre'] = deadline;
                break;
            case 'gzp-pre':
                kk['cs-gzp-pre'] = deadline;
                break;
            case 'stop-pre':
                kk['cs-stop-pre'] = deadline;
                break;
            case 'sks-pre':
                kk['cs-sks-pre'] = deadline;
                break;
        }

        var ordr = new Order({
            status: order.status,
            deadline: deadline,
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

        if(req.files['file-init'])
            ordr.info['file-init'] = `${req.files['file-init'].name}`;

        var done = await Order.create(ordr);
        if(done) {
            if(req.files['file-init']) {
                var id = done.id;
                var _dir;
                for (var i = 0; i < 1000; i++) {
                    if(id > i*1000) {
                        _dir = `${(i)*1000}-${(i+1)*1000}`;
                    }
                }

                var dir = await mkdirp(`./static/files/${_dir}/${done.id}`);
                req.files['file-init'].mv(`./static/files/${_dir}/${done.id}/${req.files['file-init'].name}`, function(err) {
                    if (err) {
                        logger.error(err);
                        return res.status(500).send(err);
                    }
                });
            }

            if(done.status == 'all-pre') {
                var ntf0 = new Notify({
                    date: Date.now(),
                    type: `start-gzp-pre`,
                    order: done._id
                });
                var ntf1 = new Notify({
                    date: Date.now(),
                    type: `start-stop-pre`,
                    order: done._id
                });
                sendMail(done, 'new-status');
                ntf0.save();
                ntf1.save();
            } else {
                done.status = stages[done.status];
                sendMail(done, 'new-status');
                var ntf = new Notify({
                    date: Date.now(),
                    type: `start-${done.status}`,
                    order: done._id
                });
                ntf.save();
            }

            clnt.usage = true;
            clnt.save();
            logger.info(`Init Order #${ done.id } | ${ done.status } | ${ done.info.client.name } | ${done.info.city.type} ${done.info.city.name}`, res.locals.__user);
            res.send({created: true})
        } else res.send({errText: 'Что-то пошло не так'});
    },

    getOrderInfo: async (req, res) => {
        var order = await Order.findOne({id: req.params.id, status: {'$ne': 'secret'}}).deepPopulate(populateQuery);
        res.locals.department = await Department.find();

        if(order) {
            order.stage = stages[order.status];
            order.resp = await helper.getRespDep(order);
            res.locals.order = order;
            render(req, res, {
                viewName: 'orders/order',
                options: {
                    tab: 'info',
                    admin: req.query.admin
                }
            });

        } else render(req, res, { view: '404' });
    },

    getOrderGZP: async (req, res) => {
        var order = await Order.findOne({id: req.params.id, status: {'$ne': 'secret'}}).deepPopulate(populateQuery);
        res.locals.department = await Department.find();

        if(order) {
            order.stage = stages[order.status];
            order.resp = await helper.getRespDep(order);
            res.locals.order = order;

            render(req, res, {
                viewName: 'orders/order',
                options: {
                    tab: 'gzp',
                    admin: req.query.admin
                }
            });

        } else render(req, res, { view: '404' });
    },

    getOrderSTOP: async (req, res) => {
        var order = await Order.findOne({id: req.params.id, status: {'$ne': 'secret'}}).deepPopulate(populateQuery);
        res.locals.department = await Department.find();

        if(order) {
            order.stage = stages[order.status];
            order.resp = await helper.getRespDep(order);
            res.locals.order = order;

            render(req, res, {
                viewName: 'orders/order',
                options: {
                    tab: 'stop',
                    admin: req.query.admin
                }
            });

        } else render(req, res, { view: '404' });
    },

    getOrderHistory: async (req, res) => {
        var order = await Order.findOne({id: req.params.id, status: {'$ne': 'secret'}}).deepPopulate(populateQuery);

        if(order) {
            order.stage = stages[order.status];
            order.resp = await helper.getRespDep(order);
            res.locals.order = order;

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

        var order = await Order.findOne({id: req.params.id});

        Object.keys(data).forEach( item => {
            data[item] = data[item].trim();
            if(data[item] == '') data[item] = undefined;
        });

        switch (req.params.tab) {
            case 'info':
                var tmp = {};

                tmp = data;

                //Клиент
                var clnt = await validator.client(data.client);

                if(!clnt._id) {
                    res.status(400).send({ errText: clnt });
                    return;
                }
                tmp.client = clnt;

                // Услуга
                var service = data.service;
                tmp.service = service;

                // Улица
                var strt = await validator.street(data.street);

                if(!strt._id) {
                    res.status(400).send({ errText: strt });
                    return;
                }
                tmp.street = strt;

                // Город
                var city = await validator.city(data.city);

                if(!city._id) {
                    res.status(400).send({ errText: city });
                    return;
                }
                tmp.city = city;

                if(data['date-sign']) {
                    var date = helper.parseDate(data['date-sign'])
                    if(date == 'err') {
                        res.status(400).send({errText: 'Неверный формат даты'})
                        return;
                    }
                    tmp['date-sign'] = date;
                }

                if(req.files && req.files.order) {
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

                var prvdr = helper.parseClient(data.provider);

                var provider = await Provider.findOne({type: prvdr.type, name: prvdr.name});

                if(!provider) {
                    res.status(400).send({errText : 'Такого провайдера не существует!'});
                    return;
                }
                data.provider = provider;
                order.stop = Object.assign(order.stop, data);
                break;
        }

        var done = await order.save();
        if(done) {
            order.history.push({
                name: 'Административная правка',
                date: new Date(),
                author: await Account.findOne({_id: res.locals.__user._id})
            });
            logger.info(`Admin edit order #${ done.id }`, res.locals.__user);
            res.status(200).send({url: `/order/${done.id}/${req.params.tab}`});
            return;
        } else {
            logger.error(`Admin edit error order #${ done.id }`, res.locals.__user);
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

            if( ((req.body.need == '1' && req.body.capability == '1')
                || (req.body.need == '0')) && isNaN(req.body.time)) {
                    res.status(400).send({ errText: 'Срок организации должен быть числом' });
                    return;
            }

            if((req.body.need == '1' && req.body.capability == '1') || (req.body.need == '0')) {

                if(!req.body['cost-once'] || !req.body['cost-monthly']) {
                    res.status(400).send({ errText: 'Укажите стоимость организации' });
                    return;
                }

            }

            if( req.body.need == '1' && req.body.capability == '0' ) {
                if(!req.body.reason) {
                    res.status(400).send({ errText: 'Укажите причину технической не возможности!' });
                    return;
                }
            }

            order.gzp = req.body;

            if(order.status == 'gzp-pre') {
                order.status = 'client-match';
                order.deadline = await helper.calculateDeadline(10);
                order.date['gzp-pre'] = new Date();
                order.date['cs-client-match'] = await helper.calculateDeadline(10);
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
                var ntf = new Notify({
                    date: Date.now(),
                    type: `end-gzp-pre`,
                    order: done._id
                });
                done = await done.deepPopulate(populateQuery);
                sendMail(done, 'new-status');
                ntf.save();
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

            order.stop = req.body;
            if(req.body.capability == '1') {

                if(!req.body.provider) {
                    res.status(400).send({errText: 'Провайдер - обязательное поле!'});
                    return;
                }

                var prvdr = helper.parseClient(req.body.provider);

                var provider = await Provider.findOne({type: prvdr.type, name: prvdr.name});

                if(!provider) {
                    res.status(400).send({errText : 'Такого провайдера не существует!'});
                    return;
                }

                order.stop.provider = provider;

                if(isNaN(req.body.time)) {
                    res.status(400).send({errText: 'Срок организации должен быть числом'});
                    return;
                }

                if(!req.body['cost-once'] || !req.body['cost-monthly']) {
                    res.status(400).send({errText: 'Укажите стоимость организации'});
                    return;
                }
            } else {

                if(!req.body.reason) {
                    res.status(400).send({errText: 'Укажите причину'});
                    return;
                }
            }

            if(order.status == 'stop-pre') {
                order.status = 'client-match';
                order.deadline = await helper.calculateDeadline(10);
                order.date['cs-client-match'] = await helper.calculateDeadline(10);
                order.date['stop-pre'] = new Date();
                order.stop.complete = true;
            }

            if(order.status == 'all-pre') {
                order.status = 'gzp-pre';
                order.date['stop-pre'] = new Date();
                order.stop.complete = true;
            }
            order.history.push({
                name: 'Завершена проработка СТОП/VSAT',
                date: new Date(),
                author: await Account.findOne({_id: res.locals.__user._id})
            });
            var done = await order.save();
            if(done) {
                var ntf = new Notify({
                    date: Date.now(),
                    type: `end-stop-pre`,
                    order: done._id
                });
                done = await done.deepPopulate(populateQuery);
                sendMail(done, 'new-status');
                ntf.save();
                if(req.body.capability == 1) {
                    provider.usage = true;
                    provider.save();
                }
                logger.info(`End pre-stop order #${ done.id }`, res.locals.__user);
                res.status(200).send({created: true});
            } else res.status(400).send({errText: 'Что-то пошло не так!'})
        } else res.status(404);
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
        var order = await Order.findOne({id: req.params.id, status: {'$ne': 'secret'}}).deepPopulate(populateQuery);

        if(!order) {
            res.status(400).send({errText: 'Изменение несуществующей заявки!'});
            return;
        }
        switch (reqData.to) {
            case 'adminEdit':

                break;
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
                var ntf = new Notify({
                    date: Date.now(),
                    type: `pause`,
                    order: order._id
                });
                sendMail(order, 'pause');
                ntf.save();
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
                var ntf = new Notify({
                    date: Date.now(),
                    type: `end-pause`,
                    order: order._id
                });
                sendMail(order, 'end-pause');
                ntf.save();
                break;
            case 'set-special':
                order.special = reqData.dep;
                var dp = await Department.findOne({_id: reqData.dep});
                order.history.push({
                    name: `Заказ направлен в ${dp.name}`,
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
                var ntf = new Notify({
                    date: Date.now(),
                    type: `reject`,
                    order: order._id
                });
                sendMail(order, 'new-status');
                ntf.save();
                break;
            case 'start-pre-stop':
                order.status = 'stop-pre';
                order.deadline = await helper.calculateDeadline(3);
                order.date['cs-stop-pre'] = await helper.calculateDeadline(3);
                order.date['client-match'] = new Date();
                order.history.push({
                    name: 'Начало проработки СТОП/VSAT',
                    date: new Date(),
                    author: await Account.findOne({_id: res.locals.__user._id})
                });
                var ntf = new Notify({
                    date: Date.now(),
                    type: `start-stop-pre`,
                    order: order._id
                });
                sendMail(order, 'new-status');
                ntf.save();
                break;
            case 'start-pre-gzp':
                order.status = 'gzp-pre';
                order.deadline = await helper.calculateDeadline(3);
                order.date['cs-gzp-pre'] = await helper.calculateDeadline(3);
                order.date['client-match'] = new Date();
                order.history.push({
                    name: 'Начало проработки ГЗП',
                    date: new Date(),
                    author: await Account.findOne({_id: res.locals.__user._id})
                });
                var ntf = new Notify({
                    date: Date.now(),
                    type: `start-gzp-pre`,
                    order: order._id
                });
                sendMail(order, 'new-status');
                ntf.save();
                break;
            case 'end-network':
                order.status = 'client-notify';
                order.deadline = await helper.calculateDeadline(2);
                order.date['cs-client-notify'] = await helper.calculateDeadline(2);
                order.date['network'] = new Date();
                order.history.push({
                    name: 'Выполнена настройка сети',
                    date: new Date(),
                    author: await Account.findOne({_id: res.locals.__user._id})
                });
                var ntf = new Notify({
                    date: Date.now(),
                    type: `network`,
                    order: order._id
                });
                sendMail(order, 'new-status');
                ntf.save();
                break;
            case 'end-build':
                order.status = 'network';
                order.date['gzp-build'] = new Date();
                order.history.push({
                    name: 'Строительство ГЗП завершено',
                    date: new Date(),
                    author: await Account.findOne({_id: res.locals.__user._id})
                });
                var ntf = new Notify({
                    date: Date.now(),
                    type: `end-gzp-build`,
                    order: order._id
                });
                sendMail(order, 'new-status');
                ntf.save();
                break;
            case 'start-gzp-build':
                if(order.gzp.need) {
                    order.status = 'gzp-build';
                } else {
                    order.status = 'install-devices';
                }
                order.deadline = await helper.calculateDeadline(order.gzp.time);
                order.date['cs-gzp-organization'] = await helper.calculateDeadline(order.gzp.time + 2);
                order.date['client-match'] = new Date();
                order.history.push({
                    name: 'Начало строительства ГЗП',
                    date: new Date(),
                    author: await Account.findOne({_id: res.locals.__user._id})
                });
                var ntf = new Notify({
                    date: Date.now(),
                    type: `start-gzp-build`,
                    order: order._id
                });
                sendMail(order, 'new-status');
                ntf.save();
                break;
            case 'end-install-devices':
                order.status = 'network';
                order.date['gzp-build'] = new Date();
                order.history.push({
                    name: 'Установлено оборудование',
                    date: new Date(),
                    author: await Account.findOne({_id: res.locals.__user._id})
                });
                var ntf = new Notify({
                    date: Date.now(),
                    type: `end-install-devices`,
                    order: order._id
                });
                sendMail(order, 'new-status');
                ntf.save();
                break;
            case 'start-stop-build':
                order.status = 'stop-build';
                order.deadline = await helper.calculateDeadline(order.stop.time);
                order.date['cs-stop-organization'] = await helper.calculateDeadline(order.stop.time + 2);
                order.date['client-match'] = new Date();
                order.history.push({
                    name: 'Начало организации через СТОП/VSAT',
                    date: new Date(),
                    author: await Account.findOne({_id: res.locals.__user._id})
                });
                var ntf = new Notify({
                    date: Date.now(),
                    type: `start-stop-build`,
                    order: order._id
                });
                sendMail(order, 'new-status');
                ntf.save();
                break;
            case 'end-build-stop':
                order.status = 'network';
                order.date['stop-build'] = new Date();
                order.history.push({
                    name: 'Завершена организация через СТОП/VSAT',
                    date: new Date(),
                    author: await Account.findOne({_id: res.locals.__user._id})
                });
                var ntf = new Notify({
                    date: Date.now(),
                    type: `end-stop-build`,
                    order: order._id
                });
                sendMail(order, 'new-status');
                ntf.save();
                break;
        }

        var done = await order.save();
        if(done) {
            logger.info(`${reqData.to} order #${done.id}`, res.locals.__user);
            if(reqData.to == 'delete') res.status(200).send({url: '/'});
            if(reqData.to == 'adminEdit') res.status(200).send({url: `/order/${done.id}/info/admin`});

            else res.status(200).send({created: true});
        } else res.status(400).send({errText: 'Изменение несуществующей заявки!'});

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
            var date = helper.parseDate(reqData['date-sign'])
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
            order.deadline = null;

            order.history.push({
                name: 'Завершено уведомление клиента. Абонент включен.',
                date: new Date(),
                author: await Account.findOne({_id: res.locals.__user._id})
            });

            var done = await order.save();
            if(done) {
                var ntf = new Notify({
                    date: Date.now(),
                    type: `end-client-notify`,
                    order: done._id
                });
                done = await done.deepPopulate(populateQuery);
                sendMail(done, 'new-status');
                ntf.save();
                logger.info(`End client-notify order #${ done.id }`, res.locals.__user);
                res.status(200).send({created: true});
            } else res.status(400).send({errText: 'Что-то пошло не так'})
        }

        if(order.status == 'client-match') {
            var mustIDOSS = (['internet', 'cloud', 'phone', 'wifi', 'iptv'].indexOf(order.info.service) >= 0);

            if(mustIDOSS && !reqData.idoss) {
                res.status(400).send({errText: 'Укажите ID OSS'});
            }
            if(reqData['income-once'] == '' || reqData['income-once'] == null) {
                res.status(400).send({errText: 'Укажите доход!'});
            }

            if(reqData['income-monthly'] == '' || reqData['income-once'] == null) {
                res.status(400).send({errText: 'Укажите доход!'});
            }

            order.info['idoss'] = reqData['idoss'];
            order.info['income-once'] = reqData['income-once'];
            order.info['income-monthly'] = reqData['income-monthly'];

            order.history.push({
                name: 'Заполнен ожидаемый доход',
                date: new Date(),
                author: await Account.findOne({_id: res.locals.__user._id})
            });

            var done = await order.save();
            if(done) {
                logger.info(`Filling income order #${ done.id }`, res.locals.__user);
                res.status(200).send({created: true});
            } else res.status(400).send({errText: 'Что-то пошло не так'})
        }
    },

    getStat: async (req, res) => {
        var deps = await Department.find();
        var orders = await Order.find({status: {'$ne': 'secret'}}).populate(populateInitiator).lean();

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

    excel: async (req, res) => {

        if(req.query.func && req.query.func.length == 1)  req.query.func = [req.query.func]
        if(req.query.pre && req.query.pre.length == 1)  req.query.pre = [req.query.pre]
        if(req.query.build && req.query.build.length == 1)  req.query.build = [req.query.build]
        if(req.query.final && req.query.final.length == 1)  req.query.final = [req.query.final]

        var query = await helper.makeQuery(req, res);
        query.special = undefined;

        var orders = await Order.find(query).populate([populateClient, populateCity, populateStreet, populateInitiator, populateProvider]).lean();
        // deepPopulate(populateQuery);
        orders.forEach( item => {
            item.status = stages[item.status];
        });

        getExcel(orders, res);

    },

    searchReset: async (req, res) => {
        var usr = await Account.findOne({_id: res.locals.__user._id});
        usr.settings.search.query = '/search';
        var done = await usr.save();
        if(done) {
            res.redirect('/search?');
            return;
        } else return;
    },

    search: async (req, res) => {
        res.locals.data = await helper.getData();
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
        var query = await helper.makeQuery(req, res);

        var pagerId = 'first',
            pagers = [],
            pageNumber = req.query['pager' + pagerId] || 1,
            perPage = res.locals.__user.settings.table.perPage || 25;

        if (!!(+pageNumber) && (+pageNumber) > 0) {
            pageNumber = +pageNumber;
            pagers[0] = pagerId;
        }
        else
            res.redirect(req.path);

        var orders = await Order.find(query).populate([populateClient, populateCity, populateStreet]).lean();

        var total = orders.length;

        if(req.query.sort)
            orders = helper.orderSort(orders, req.query.sort, req.query.value);

        orders = orders.slice((pageNumber - 1)*perPage, (pageNumber - 1)*perPage + perPage);

        orders.forEach( item => {
            item.status = stages[item.status];
        });

        res.locals.pagers = {};
        res.locals.pagers[pagerId] = {
            pageNumber: +pageNumber,
            records: total,
            perPage: perPage
        };

        res.locals.orders = orders;

        render(req, res, {
            viewName: 'search',
            options: {
                pagers: pagers
            }
        });
    }
}
