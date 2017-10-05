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
var fileSystem = require('fs');
const fields = require('./fields');
var path = require('path');
var url = require('url');

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
    'reject': 'Заявка отклонена'
};

var populateQuery = `info.initiator info.initiator.department info.client info.client.type info.service info.city stop.provider`;

const Render = require('../render'),
    render = Render.render;

const logger = require('./logger');

module.exports = {

    getPageInit: async (req, res) => {
        if(res.locals.__user.department.type == 'b2b' || res.locals.__user.department.type == 'b2o') {

            res.locals.services = await Service.find();
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
            perPage = 20; // TODO брать из конфига?

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
                item.cs = calculateCS(item);
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

            if(!!!date) {
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

        var clnt = order.info.client;
        if(clnt == 'err') {
            res.status(400).send({ errText: 'Введите коректное название клиента. Например Apple' });
            return;
        }
        clnt = await Client.find({name: clnt});

        if(clnt.length == 0) {
            res.status(400).send({ errText: 'Такого клиента не существует.' });
            return;
        }

        if(clnt.length > 1) {
            res.status(400).send({ errText: 'Клиентов с похожим названием найдено несколько. Пожалуйста уточните.' });
            return;
        }

        order.info.client = clnt[0];

        var service = await Service.findOne({ _id: order.info.service });
        order.info.service = service;

        order.info.city = parserCity(order.info.city);

        var tmpCity = await City.find({ type: order.info.city.type, name: order.info.city.name });

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

        var done = await Order.create(ordr);
        if(done) {
            service.usage = true;
            service.save();
            clnt[0].usage = true;
            clnt[0].save();
            logger.info(`Init Order #${ done.id } | ${ done.status } | ${ done.info.client.name } | ${done.info.city.type} ${done.info.city.name}`, res.locals.__user);
            res.send({created: true})
        } else res.send({errText: 'Что-то пошло не так'});
    },

    getOrderInfo: async (req, res) => {
        var order = await Order.findOne({id: req.params.id}).deepPopulate(populateQuery);
        order.cs = calculateCS(order);
        order.stage = stages[order.status];
        res.locals.dataset = await getData();

        if(order) {
            res.locals.order = order;

            render(req, res, {
                viewName: 'orders/order',
                options: {
                    tab: 'info'
                }
            });

        } else render(req, res, { view: '404' });
    },

    getOrderGZP: async (req, res) => {
        var order = await Order.findOne({id: req.params.id}).deepPopulate(populateQuery);
        order.cs = calculateCS(order);
        order.stage = stages[order.status];
        res.locals.dataset = await getData();

        if(order) {
            res.locals.order = order;

            render(req, res, {
                viewName: 'orders/order',
                options: {
                    tab: 'gzp'
                }
            });

        } else render(req, res, { view: '404' });
    },

    getOrderSTOP: async (req, res) => {
        var order = await Order.findOne({id: req.params.id}).deepPopulate(populateQuery);
        order.cs = calculateCS(order);
        order.stage = stages[order.status];
        res.locals.dataset = await getData();

        if(order) {
            res.locals.order = order;

            render(req, res, {
                viewName: 'orders/order',
                options: {
                    tab: 'stop'
                }
            });

        } else render(req, res, { view: '404' });
    },

    getOrderHistory: async (req, res) => {
        var order = await Order.findOne({id: req.params.id}).deepPopulate(populateQuery);
        order.cs = calculateCS(order);
        if(order) {
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

    endPreGZP: async (req, res) => {
        var order = await Order.findOne({id: req.params.id}).deepPopulate(populateQuery);
        if( order ) {
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
                order.date['gzp-pre'] = new Date();
                order.gzp.complete = true;
            }

            if(order.status == 'all-pre') {
                order.status = 'stop-pre';
                order.date['gzp-pre'] = new Date();
                order.gzp.complete = true;
            }

            var done = await order.save();
            if(done)
                logger.info(`End pre-gzp order #${ done.id }`, res.locals.__user);
            res.status(200).send({created: true})
        } else res.status(400).send({created: false});
    },

    endPreSTOP: async (req, res) => {
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
            if(!req.body.provider) {
                res.status(400).send({ errText: 'Провайдер - обязательное поле!' });
                return;
            }

            order.stop = req.body;
            var prvdr = parseClient(req.body.provider);

            var provider = await Provider.findOne({type: prvdr.type, name: prvdr.name});

            order.stop.provider = provider;

            if(order.stop.provider) {
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
                var done = await order.save();
                if(done) {
                    provider.usage = true;
                    provider.save();
                    logger.info(`End pre-stop order #${ done.id }`, res.locals.__user);
                    res.send({created: true})
                }

            } else res.status(400).send({errText : 'Уточните название провайдера'});
        } else res.send({created: false})
    },

    endClientNotify: async (req, res) => {
        var reqData = req.body;
        var order = await Order.findOne({id: req.params.id});
        if(order.status == 'client-notify') {
            var id = order.id;
            var _dir;
            for (var i = 0; i < 1000; i++) {
                if(id > i*1000) {
                    _dir = `${(i)*1000}-${(i+1)*1000}`;
                }
            }
            if(!!!req.files.order) {
                res.status(400).send({errText: 'Договор - обязателен!'})
                return;
            }
            if(!!!reqData['date-sign']) {
                res.status(400).send({errText: 'Дата подписания - обязательна!'})
                return;
            }
            var date = parseDate(reqData['date-sign'])
            if(!!!date) {
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

            // console.log(order.info['date-sign']);
            order.info.order = `${req.files.order.name}`;
            order.status = 'succes';
            order.date['succes'] = new Date();
            var done = await order.save();
            if(done) {
                logger.info(`End client-notify order #${ done.id }`, res.locals.__user);
                res.send({created: true});
            } else res.send({created: false})
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
        var order = await Order.findOne({id: req.params.id});
        if( order) {

            switch (reqData.to) {
                case 'reject':
                    order.status = 'reject';
                    break;
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
                case 'start-stop-build':
                    order.status = 'stop-build';
                    order.date['client-match'] = new Date();
                    break;
                case 'end-build-stop':
                    order.status = 'network';
                    order.date['stop-build'] = new Date();
                    break;
            }

            var done = await order.save();
            if(done)
                logger.info(`${reqData.to} order #${ done.id }`, res.locals.__user);
            res.send(true);

        } else res.send(false);

    },

    getStat: async (req, res) => {
        var deps = await Department.find();
        var orders = await Order.find().populate('info.initiator');

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
                        }
                    });
                    break;

            }
            return {
                status: item.status,
                cs: calculateCS(item),
                pause: item.pause,
                worker: item.worker
            }
        });
        // console.log(orders);

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
                if(item.cs < 0) stages.pre.bad++;
            }

            if(build.indexOf(item.status) >= 0) {
                stages.build.all++;
                if(item.cs < 0) stages.build.bad++;
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
                            if(item.cs < 0) dprtmts[i._id].pre.bad++;
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
                        if(item.cs < 0) dprtmts[item.worker._id].pre.bad++;
                    }

                    if(build.indexOf(item.status) >= 0) {
                        dprtmts[item.worker._id].build.all++;
                        if(item.cs < 0) dprtmts[item.worker._id].build.bad++;
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
            if( usr.settings.search.query &&
                (usr.settings.search.query != '/search' &&
                usr.settings.search.query != '/search/' )) {
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
            item.cs = calculateCS(item);
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
    for (var i = 0; i < str.length; i++) {
        if(str[i] === '.') {
            res.type += '.';
            res.name = str.slice(i+2, str.length);
            return res;
        } else res.type += ''+str[i];
    }
    return 'err';
}

var makeQuery = async (req, res) => {
    var qr = {};
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
            qr['info.initiator'] = '' + res.locals.__user._id;
        }
        if(query.func.indexOf('2') >= 0) {
            qr['special'] = true;
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

    if(status.length > 0)
        qr['$or'] = status;

    if(query.client) {
        var clnt = query.client;
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

function calculateCS(order) {
    var date;
    var time;

    switch (order.status) {
        case 'client-match':
            var gzp = order.date['gzp-pre'];
            var stop = order.date['stop-pre'];
            time = 10;
            if(!!gzp && !!stop) {
                if(gzp > stop) {
                    date = gzp;
                } else {
                    date = stop;
                }
            } else {
                if(!!gzp) {
                    date = gzp;
                }
                if(!!stop) {
                    date = stop;
                }
            }
            break;
        case 'client-notify':
            date = order.date['network'];
            time = 2;
            break;
        case 'network':
            date = order.date['client-match'];
            var gzp = order.date['gzp-build'];
            var stop = order.date['stop-build'];
            if(!!gzp)  time = order.gzp.time;
            if(!!stop) time = order.stop.time;
            break;
        case 'gzp-pre':
            var d = order.date['client-match'];
            if(d) date = d;
            else  date = order.date['init'];
            time = 3;
            break;
        case 'stop-pre':
            var d = order.date['client-match'];
            if(d) date = d;
            else  date = order.date['init'];
            time = 3;
            break;
        case 'all-pre':
            date = order.date['init'];
            time = 3;
            break;
        case 'install-devices':
            date = order.date['client-match'];
            time = order.gzp.time;
            break;
        case 'gzp-build':
            date = order.date['client-match'];
            time = order.gzp.time;
            break;
        case 'stop-build':
            date = order.date['client-match'];
            time = order.stop.time;
            break;
        default:
            date = 0;
    }
    if(date == 0) return '';
    var d = Math.abs(date - new Date());
    var diffDays = Math.ceil(d / (1000 * 3600 * 24));
    return time - diffDays + 1;
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

    cities = cities.map( i => `${i.name}`);

    services = services.map( i => {
        return {
            val: `${i.name}`,
            text: `${i.name}`
        }
    });

    return {
        clients: clients,
        providers: providers,
        cities: cities,
        services: services
    }

}
