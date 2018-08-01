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
const Flag = require('../models/Flag');
const notify = require('./notify');
const { sendMail } = require('./mailer');
const { getExcel } = require('./export');

const helper = require('./helper');
const validator = require('./validator');

var stages = require('../common-data').stages;

var populateQuery = `info.initiator info.initiator.department info.client info.client.type info.city info.street stop.provider`;
var shortPop = 'info.client.type info.city info.street';

var populateAll = [
    populateClient,
    populateInitiator,
    populateCity,
    populateStreet,
    populateProvider,
    populateSpecial
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

var populateSpecial = {
    path: 'special',
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

    getMainPageClient: async (req, res) => {
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

        var query = {};
        var subQ = await helper.makeQuery(req, res);

        var user = res.locals.__user;

        var u = await Account.findOne({login: user.login});
        u.last = '/client';
        u.save();

        query = {
            'info.initiator': user._id,
            $or: [
                {status: 'client-match'},
                {status: 'client-notify'}
            ]
        };

        var orders = await Order.find({
            $and: [query, subQ],
            status: {$ne: 'secret'},
            'pause.status': {$ne : true}
        }).populate([populateClient, populateCity, populateStreet]).lean();

        var orders1 = await Order.find({
            $and: [query, subQ],
            status: {$ne: 'secret'},
            'pause.status': true
        }).populate([populateClient, populateCity, populateStreet]).lean();

        var total = orders.length + orders1.length;

        if(!req.query.sort) { req.query.sort = 'id'; req.query.value = -1 };

        if(req.query.sort) {
            orders = helper.orderSort(orders, req.query.sort, req.query.value);
            orders1 = helper.orderSort(orders1, req.query.sort, req.query.value);
        }

        orders = orders.concat(orders1)

        orders = orders.slice((pageNumber - 1)*perPage, (pageNumber - 1)*perPage + perPage);

        var now = new Date();
        orders.forEach( item => {
            item.cs = helper.calculateCS(item);
            item.status = stages[item.status];
            item.initDate = helper.dateToStr(item.date.init)
        });

        if (!orders.length)
        {
            if (pageNumber !== 1) {
                res.redirect(req.path);
            } else {
                render(req, res, {
                    viewName: 'main',
                    options: {
                        tab: 'client'
                    }
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
                viewName: 'main',
                options: {
                    pagers: pagers,
                    tab: 'client'
                }
            });
        }
    },

    getMainPageMy: async (req, res) => {
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

        var query = {};
        var subQ = await helper.makeQuery(req, res);

        var user = res.locals.__user;

        var u = await Account.findOne({login: user.login});
        u.last = '/my';
        u.save();

        query = {
            'info.initiator': user._id,
            $and: [
                { status: {$ne: 'succes'}},
                { status: {$ne: 'reject'}},
                { status: {$ne:'client-match'}},
                { status: {$ne:'client-notify'}}
            ]

        };

        var orders = await Order.find({
            $and: [query, subQ],
            status: {$ne: 'secret'},
            'pause.status': {$ne : true}
        }).populate([populateClient, populateCity, populateStreet]).lean();

        var orders1 = await Order.find({
            $and: [query, subQ],
            status: {$ne: 'secret'},
            'pause.status': true
        }).populate([populateClient, populateCity, populateStreet]).lean();

        var total = orders.length + orders1.length;

        if(!req.query.sort) { req.query.sort = 'id'; req.query.value = -1 };

        if(req.query.sort) {
            orders = helper.orderSort(orders, req.query.sort, req.query.value);
            orders1 = helper.orderSort(orders1, req.query.sort, req.query.value);
        }

        orders = orders.concat(orders1)

        orders = orders.slice((pageNumber - 1)*perPage, (pageNumber - 1)*perPage + perPage);

        var now = new Date();
        orders.forEach( item => {
            item.cs = helper.calculateCS(item);
            item.status = stages[item.status];
            item.initDate = helper.dateToStr(item.date.init)
        });

        if (!orders.length)
        {
            if (pageNumber !== 1) {
                res.redirect(req.path);
            } else {
                render(req, res, {
                    viewName: 'main',
                    options: {
                        tab: 'my'
                    }
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
                viewName: 'main',
                options: {
                    pagers: pagers,
                    tab: 'my'
                }
            });
        }
    },

    getMainPagePre: async (req, res) => {

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

        var query = {};
        var subQ = await helper.makeQuery(req, res);

        var user = res.locals.__user;

        var u = await Account.findOne({login: user.login});
        u.last = '/pre';
        u.save();

        switch (user.department.type) {
            case 'b2o':
                query = {
                    $or: [
                        {status: 'stop-pre'},
                        {status: 'all-pre'}
                    ]
                };
                break;
            case 'gus':
                query = {
                    '$or': [
                        {status: 'gzp-pre', 'info.city': user.department.cities, special: null},
                        {status: 'all-pre', 'info.city': user.department.cities, special: null},
                        {status: 'gzp-pre', 'special': user.department._id},
                        {status: 'all-pre', 'special': user.department._id}
                    ]
                }
                break;
            case 'sks':
                query = { status: 'sks-pre' };
                break;
            case 'net':
                query = { status: 'network' };
                break;
        }

        var orders = await Order.find({
            $and: [query, subQ],
            status: {$ne: 'secret'},
            'pause.status': {$ne : true}
        }).populate([populateClient, populateCity, populateStreet]).lean();

        var orders1 = await Order.find({
            $and: [query, subQ],
            status: {$ne: 'secret'},
            'pause.status': true
        }).populate([populateClient, populateCity, populateStreet]).lean();

        var total = orders.length + orders1.length;

        if(!req.query.sort) { req.query.sort = 'id'; req.query.value = -1 };

        if(req.query.sort) {
            orders = helper.orderSort(orders, req.query.sort, req.query.value);
            orders1 = helper.orderSort(orders1, req.query.sort, req.query.value);
        }

        orders = orders.concat(orders1)

        orders = orders.slice((pageNumber - 1)*perPage, (pageNumber - 1)*perPage + perPage);

        var now = new Date();
        orders.forEach( item => {
            item.cs = helper.calculateCS(item);
            item.status = stages[item.status];
            item.initDate = helper.dateToStr(item.date.init)
        });

        if (!orders.length)
        {
            if (pageNumber !== 1) {
                res.redirect(req.path);
            } else {
                render(req, res, {
                    viewName: 'main',
                    options: {
                        tab: 'pre'
                    }
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
                viewName: 'main',
                options: {
                    pagers: pagers,
                    tab: 'pre'
                }
            });
        }

    },

    getMainPageBuild: async (req, res) => {

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

        var query = {};
        var subQ = await helper.makeQuery(req, res);

        var user = res.locals.__user;

        var u = await Account.findOne({login: user.login});
        u.last = '/build';
        u.save();

        switch (user.department.type) {
            case 'b2o':
                query = {
                    status: 'stop-build'
                };
                break;
            case 'gus':
                query = {
                    '$or': [
                        {status: 'gzp-build', 'info.city': user.department.cities, special: null},
                        {status: 'install-devices', 'info.city': user.department.cities, special: null},
                        {status: 'gzp-build', special: user.department._id},
                        {status: 'install-devices', special: user.department._id}
                    ]
                }
                break;
            case 'sks':
                query = { status: 'sks-build' };
                break;
        }

        var orders = await Order.find({
            $and: [query, subQ],
            status: {$ne: 'secret'},
            'pause.status': {$ne : true}
        }).populate([populateClient, populateCity, populateStreet]).lean();

        var orders1 = await Order.find({
            $and: [query, subQ],
            status: {$ne: 'secret'},
            'pause.status': true
        }).populate([populateClient, populateCity, populateStreet]).lean();

        var total = orders.length + orders1.length;

        if(!req.query.sort) { req.query.sort = 'id'; req.query.value = -1 };

        if(req.query.sort) {
            orders = helper.orderSort(orders, req.query.sort, req.query.value);
            orders1 = helper.orderSort(orders1, req.query.sort, req.query.value);
        }

        orders = orders.concat(orders1)

        orders = orders.slice((pageNumber - 1)*perPage, (pageNumber - 1)*perPage + perPage);

        var now = new Date();
        orders.forEach( item => {
            item.cs = helper.calculateCS(item);
            item.status = stages[item.status];
            item.initDate = helper.dateToStr(item.date.init)
        });

        if (!orders.length)
        {
            if (pageNumber !== 1) {
                res.redirect(req.path);
            } else {
                render(req, res, {
                    viewName: 'main',
                    options: {
                        tab: 'build'
                    }
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
                viewName: 'main',
                options: {
                    pagers: pagers,
                    tab: 'build'
                }
            });
        }

    },

    init: async (req, res, io) => {
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

        if(order.info['date-request']) {
            var date = helper.parseDate(order.info['date-request'])
            if(!date) {
                res.status(400).send({errText: 'Неверный формат даты'})
                return;
            }
            order.info['date-request'] = date;
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

        if(order.info.service == 'iptv' || order.info.service == 'l2vpn' || order.info.service == 'vpls') {

          // if(!order.info.relation) {
          //   res.status(400).send({ errText: 'Укажите связанный заказ' });
          //   return;
          // }
          if(order.info.relation) {
            if(isNaN(order.info.relation)) {
              res.status(400).send({ errText: 'Связанный заказ - ID заказа должен быть числом' });
              return;
            }
            var tep = await Order.findOne({id: order.info.relation});

            if(!tep) {
              res.status(400).send({ errText: 'Заказа с таким ID нет в системе!' });
              return;
            }
          }
        }

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
            history: [helper.historyGenerator('init', res.locals.__user)]
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
                notify.create(res.locals.__user, done, 'start-gzp-pre');
                notify.create(res.locals.__user, done, 'start-stop-pre');
                // sendMail(done, 'new-status');

            } else {
                notify.create(res.locals.__user, done, `start-${done.status}`);
                done.status = stages[done.status];
                // sendMail(done, 'new-status');
            }

            logger.info(`Init Order #${ done.id } | ${ done.status } | ${ done.info.client.name } | ${done.info.city.type} ${done.info.city.name}`, res.locals.__user);
            res.send({created: true})
        } else res.send({errText: 'Что-то пошло не так'});
    },

    getOrderInfo: async (req, res) => {
        if(isNaN(req.params.id)) {
             render(req, res, { view: '404' });
             return;
        }
        var order = await Order.findOne({id: req.params.id, status: {'$ne': 'secret'}}).deepPopulate(populateQuery);

        if(order) {
            res.locals.users = await Account
                    .find({status: true})
                    .populate({
                        path: 'department',
                        select: 'name',
                        options: {
                            lean: true
                        }
                    })
                    .sort('name')
                    .lean();
            res.locals.department = await Department.find();
            order.cs = helper.calculateCS(order);

            order.stage = stages[order.status];
            order.resp = await helper.getRespDepName(order);
            order.zone = await helper.getZone(order);
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

    getOrderSKS: async (req, res) => {
        if(isNaN(req.params.id)) {
             render(req, res, { view: '404' });
             return;
        }
        var order = await Order.findOne({id: req.params.id, status: {'$ne': 'secret'}}).deepPopulate(populateQuery);

        if(order) {
            res.locals.users = await Account
                    .find({status: true})
                    .populate({
                        path: 'department',
                        select: 'name',
                        options: {
                            lean: true
                        }
                    })
                    .sort('name')
                    .lean();
            res.locals.department = await Department.find();
            order.cs = helper.calculateCS(order);

            order.stage = stages[order.status];
            order.resp = await helper.getRespDepName(order);
            res.locals.order = order;

            render(req, res, {
                viewName: 'orders/order',
                options: {
                    tab: 'sks',
                    admin: req.query.admin
                }
            });

        } else render(req, res, { view: '404' });
    },

    getOrderGZP: async (req, res) => {
        if(isNaN(req.params.id)) {
             render(req, res, { view: '404' });
             return;
        }
        var order = await Order.findOne({id: req.params.id, status: {'$ne': 'secret'}}).deepPopulate(populateQuery);

        if(order) {
            res.locals.users = await Account
                    .find({status: true})
                    .populate({
                        path: 'department',
                        select: 'name',
                        options: {
                            lean: true
                        }
                    })
                    .sort('name')
                    .lean();
            res.locals.department = await Department.find();
            order.cs = helper.calculateCS(order);

            order.stage = stages[order.status];
            order.resp = await helper.getRespDepName(order);
            order.zone = await helper.getZone(order);
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
        if(isNaN(req.params.id)) {
             render(req, res, { view: '404' });
             return;
        }
        var order = await Order.findOne({id: req.params.id, status: {'$ne': 'secret'}}).deepPopulate(populateQuery);

        if(order) {
            res.locals.users = await Account
                    .find({status: true})
                    .populate({
                        path: 'department',
                        select: 'name',
                        options: {
                            lean: true
                        }
                    })
                    .sort('name')
                    .lean();
            res.locals.department = await Department.find();
            order.cs = helper.calculateCS(order);

            order.stage = stages[order.status];
            order.resp = await helper.getRespDepName(order);
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
        if(isNaN(req.params.id)) {
             render(req, res, { view: '404' });
             return;
        }
        var order = await Order.findOne({id: req.params.id, status: {'$ne': 'secret'}}).deepPopulate(populateQuery);

        if(order) {
            res.locals.users = await Account
                    .find({status: true})
                    .populate({
                        path: 'department',
                        select: 'name',
                        options: {
                            lean: true
                        }
                    })
                    .sort('name')
                    .lean();
            res.locals.department = await Department.find();
            order.cs = helper.calculateCS(order);

            order.stage = stages[order.status];
            order.resp = await helper.getRespDepName(order);
            res.locals.order = order;

            render(req, res, {
                viewName: 'orders/order',
                options: {
                    tab: 'history'
                }
            });

        } else render(req, res, { view: '404' });
    },

    adminEdit: async (req, res, io) => {
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

        order.history.push(helper.historyGenerator('admin', res.locals.__user));
        notify.create(res.locals.__user, order, 'admin');
        var done = await order.save();
        if(done) {
            logger.info(`Admin edit order #${ done.id }`, res.locals.__user);
            res.status(200).send({url: `/order/${done.id}/${req.params.tab}`});
            return;
        } else {
            logger.error(`Admin edit error order #${ done.id }`, res.locals.__user);
            res.status(400).send({errText: 'Неизвестная ошибка!'});
            return;
        }
    },

    endPreGZP: async (req, res, io) => {
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

            if(order.pause.status) {
                var now = new Date();
                var pause = order.pause.date;
                pause = Math.round((now - pause) / 1000 / 60 / 60 / 24);
                order.deadline = new Date(order.deadline.getFullYear(), order.deadline.getMonth(), order.deadline.getDate() + pause, 0, 0, 0, 0)
                order.pause = {
                    status: false,
                    date: undefined
                };
                order.history.push(helper.historyGenerator('pause-stop', res.locals.__user));
                // notify.create(res.locals.__user, order, 'pause-stop');
            }

            order.history.push(helper.historyGenerator('gzp-pre', res.locals.__user));
            var done = await order.save();
            if(done) {
                notify.create(res.locals.__user, done, 'end-gzp-pre');
                // done = await done.deepPopulate(populateQuery);
                // sendMail(done, 'new-status');
                logger.info(`End pre-gzp order #${ done.id }`, res.locals.__user);
                res.status(200).send({created: true})
            } else res.status(400).send({errText: 'Что-то пошло не так!'});
        } else res.status(404);
    },

    endPreSKS: async (req, res) => {
        var order = await Order.findOne({id: req.params.id}).deepPopulate(populateQuery);
        if(order) {
            Object.keys(req.body).forEach( item => {
                req.body[item] = req.body[item].trim();
                if(req.body[item] == '') req.body[item] = undefined;
            });

            if( isNaN(req.body.time) ) {
                res.status(400).send({ errText: 'Срок организации должен быть числом' });
                return;
            }

            if(!req.body['cost-once'] || !req.body['cost-monthly']) {
                res.status(400).send({ errText: 'Укажите стоимость организации' });
                return;
            }

            order.sks = req.body;

            order.status = 'client-match';
            order.deadline = await helper.calculateDeadline(10);
            order.date['sks-pre'] = new Date();
            order.date['cs-client-match'] = await helper.calculateDeadline(10);

            if(order.pause.status) {
                var now = new Date();
                var pause = order.pause.date;
                pause = Math.round((now - pause) / 1000 / 60 / 60 / 24);
                order.deadline = new Date(order.deadline.getFullYear(), order.deadline.getMonth(), order.deadline.getDate() + pause, 0, 0, 0, 0)
                order.pause = {
                    status: false,
                    date: undefined
                };
                order.history.push(helper.historyGenerator('pause-stop', res.locals.__user));
                // notify.create(res.locals.__user, order, 'pause-stop');
            }

            order.history.push(helper.historyGenerator('sks-pre', res.locals.__user));
            var done = await order.save();
            if(done) {
                notify.create(res.locals.__user, done, 'end-sks-pre');

                logger.info(`Выполнена проработка СКС #${ done.id }`, res.locals.__user);
                res.status(200).send({created: true})
            } else res.status(400).send({errText: 'Что-то пошло не так!'});
        } else res.status(404);
    },

    endPreSTOP: async (req, res, io) => {
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

            if(order.pause.status) {
                var now = new Date();
                var pause = order.pause.date;
                pause = Math.round((now - pause) / 1000 / 60 / 60 / 24);
                order.deadline = new Date(order.deadline.getFullYear(), order.deadline.getMonth(), order.deadline.getDate() + pause, 0, 0, 0, 0)
                order.pause = {
                    status: false,
                    date: undefined
                };
                order.history.push(helper.historyGenerator('pause-stop', res.locals.__user));
                // notify.create(res.locals.__user, order, 'pause-stop');
            }

            order.history.push(helper.historyGenerator('stop-pre', res.locals.__user));
            var done = await order.save();
            if(done) {
                notify.create(res.locals.__user, done, 'end-stop-pre');
                // done = await done.deepPopulate(populateQuery);
                // sendMail(done, 'new-status');
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

    getFileOld: async (req, res) => {
        var order = await Order.findOne({id: req.params.id});
        var params = req.params;
        if(order) {
            var filePath = `./static/files/docs/${params.dir}/${params.number}/${params.name}`;
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

    changeStatus: async (req, res, io) => {
        var reqData = req.body;
        var order = await Order.findOne({id: req.params.id, status: {'$ne': 'secret'}}).deepPopulate(populateQuery);

        if(!order) {
            res.status(400).send({errText: 'Изменение несуществующей заявки!'});
            return;
        }

        if(order.pause.status && reqData.to != 'stop-pause') {
            var now = new Date();
            var pause = order.pause.date;
            pause = Math.round((now - pause) / 1000 / 60 / 60 / 24);
            order.deadline = new Date(order.deadline.getFullYear(), order.deadline.getMonth(), order.deadline.getDate() + pause, 0, 0, 0, 0)
            order.pause = {
                status: false,
                date: undefined
            };
            order.history.push(helper.historyGenerator('pause-stop', res.locals.__user));
            // notify.create(res.locals.__user, order, 'pause-stop');
        }

        switch (reqData.to) {
            case 'adminEdit':

                break;
            case 'pause':
                order.pause = {
                    status: true,
                    date: new Date()
                };
                order.history.push(helper.historyGenerator('pause-start', res.locals.__user));
                notify.create(res.locals.__user, order, 'pause-start');
                // sendMail(order, 'pause');
                break;
            case 'stop-pause':
                var now = new Date();
                var pause = order.pause.date;
                pause = Math.round((now - pause) / 1000 / 60 / 60 / 24);
                order.deadline = new Date(order.deadline.getFullYear(), order.deadline.getMonth(), order.deadline.getDate() + pause, 0, 0, 0, 0)
                order.pause = {
                    status: false,
                    date: undefined
                };
                order.history.push(helper.historyGenerator('pause-stop', res.locals.__user));
                notify.create(res.locals.__user, order, 'pause-stop');
                break;
            // case 'set-special':
            //     order.special = reqData.dep;
            //     var dp = await Department.findOne({_id: reqData.dep});
            //     order.history.push(helper.historyGenerator('pause-stop', res.locals.__user));
            //     break;
            case 'delete':
                order.status = 'secret';
                order.deadline = null;
                order.history.push(helper.historyGenerator('delete', res.locals.__user));
                break;
            case 'reject':
                order.status = 'reject';
                order.deadline = null;
                order.history.push(helper.historyGenerator('reject', res.locals.__user));
                break;
            case 'start-pre-stop':
                order.status = 'stop-pre';
                order.deadline = await helper.calculateDeadline(3);
                order.date['cs-stop-pre'] = await helper.calculateDeadline(3);
                order.date['client-match'] = new Date();
                notify.create(res.locals.__user, order, 'start-stop-pre');
                break;
            case 'start-pre-gzp':
                order.status = 'gzp-pre';
                order.deadline = await helper.calculateDeadline(3);
                order.date['cs-gzp-pre'] = await helper.calculateDeadline(3);
                order.date['client-match'] = new Date();
                notify.create(res.locals.__user, order, 'start-gzp-pre');
                break;
            case 'start-sks-pre':
                order.status = 'sks-pre';
                order.deadline = await helper.calculateDeadline(3);
                order.date['cs-sks-pre'] = await helper.calculateDeadline(3);
                order.date['client-match'] = new Date();
                notify.create(res.locals.__user, order, 'start-sks-pre');
                break;
            case 'end-network':
                order.status = 'client-notify';
                order.deadline = await helper.calculateDeadline(2);
                order.date['cs-client-notify'] = await helper.calculateDeadline(2);
                order.date['network'] = new Date();
                order.history.push(helper.historyGenerator('network', res.locals.__user));
                notify.create(res.locals.__user, order, 'network');
                break;
            case 'end-build':
                order.status = 'network';
                order.date['gzp-build'] = new Date();
                order.history.push(helper.historyGenerator('gzp-build', res.locals.__user));
                notify.create(res.locals.__user, order, 'end-gzp-build');
                break;
            case 'end-sks-build':
                order.status = 'network';
                order.date['sks-build'] = new Date();
                order.history.push(helper.historyGenerator('sks-build', res.locals.__user));
                notify.create(res.locals.__user, order, 'sks-gzp-build');
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

                order.history.push(helper.historyGenerator('client-match', res.locals.__user));
                notify.create(res.locals.__user, order, `start-${order.status}`);
                break;
            case 'start-sks-build':
                order.status = 'sks-build';
                order.deadline = await helper.calculateDeadline(order.sks.time);
                order.date['cs-sks-organization'] = await helper.calculateDeadline(order.sks.time + 2);
                order.date['client-match'] = new Date();
                order.history.push(helper.historyGenerator('client-match', res.locals.__user));
                notify.create(res.locals.__user, order, `start-sks-build`);
                break;
            case 'end-install-devices':
                order.status = 'network';
                order.date['gzp-build'] = new Date();
                order.history.push(helper.historyGenerator('install-devices', res.locals.__user));
                notify.create(res.locals.__user, order, `end-install-devices`);
                break;
            case 'start-stop-build':
                order.status = 'stop-build';
                order.deadline = await helper.calculateDeadline(order.stop.time);
                order.date['cs-stop-organization'] = await helper.calculateDeadline(order.stop.time + 2);
                order.date['client-match'] = new Date();
                order.history.push(helper.historyGenerator('client-match', res.locals.__user));
                notify.create(res.locals.__user, order, `start-stop-build`);
                break;
            case 'end-build-stop':
                order.status = 'network';
                order.date['stop-build'] = new Date();
                order.history.push(helper.historyGenerator('stop-build', res.locals.__user));
                notify.create(res.locals.__user, order, `end-stop-build`);
                break;
            case 'comeback':
                if(order.date['gzp-build']) {
                    if(order.gzp.need) {
                        order.status = 'gzp-build';
                        notify.create(res.locals.__user, order, `start-gzp-build`);
                    } else {
                        order.status = 'install-devices';
                        notify.create(res.locals.__user, order, `start-install-devices`);
                    }
                }
                if(order.date['stop-build']) {
                    order.status = 'stop-build';
                    notify.create(res.locals.__user, order, `start-stop-build`);
                }
                order.history.push(helper.historyGenerator('comeback', res.locals.__user));
                break;
        }

        var done = await order.save();
        if(done) {
            logger.info(`${reqData.to} order #${done.id}`, res.locals.__user);
            if(reqData.to == 'delete') return res.status(200).send({url: '/'});
            if(reqData.to == 'adminEdit') res.status(200).send({url: `/order/${done.id}/info/admin`});

            else res.status(200).send({created: true});
        } else res.status(400).send({errText: 'Изменение несуществующей заявки!'});

    },

    endClientNotify: async (req, res, io) => {
        var reqData = req.body;
        var order = await Order.findOne({id: req.params.id}).populate(populateClient);

        if(!order) {
            res.status(400).send({errText: 'Ошибка при сохранении!'});
            return;
        }

        if(!req.body['date-request']) {
          order.info['date-request'] = undefined;
          await order.save()
        } else {
          var date = helper.parseDate(req.body['date-request'])
          if(!date || date == 'Invalid Date') {
              res.status(400).send({errText: 'Неверный формат даты'})
              return;
          }
          order.info['date-request'] = date;
          await order.save()
        }

        if(req.body.service) {
          var ser = req.body.service;

          var needNotify = (ser != order.info.service);

          if(ser == 'iptv' || ser == 'l2vpn' || ser == 'vpls') {
            // if(!req.body.relation) {
            //   res.status(400).send({errText: 'Заполните связанный заказ!'})
            //   return;
            // }
            if(req.body.relation) {
              if(req.body.relation && isNaN(req.body.relation)) {
                res.status(400).send({errText: 'Связанный заказ - ID заказа должен быть числом!'})
                return;
              }
              var tep = await Order.findOne({id: req.body.relation});
              if(!tep) {
                res.status(400).send({ errText: 'Заказа с таким ID нет в системе!' });
                return;
              }
              order.info.relation = req.body.relation;
              
            }

          } else order.info.relation = undefined;

          order.info.service = ser;

          if(req.body.volume && req.body.volume != order.info.volume) needNotify = true;
          order.info.volume = req.body.volume;

          if(req.body.ip && req.body.ip != order.info.ip) needNotify = true;
          order.info.ip = req.body.ip;

          if(needNotify) {
            order.history.push(helper.historyGenerator('change-params', res.locals.__user));
            notify.create(res.locals.__user, order, `change-params`);
          }

          await order.save();

        }

        if (req.body.contact) {
          order.info.contact = req.body.contact;
          await order.save()
        }

        order.info.add_info = req.body.add_info;
        await order.save()

        if(req.files && req.files['file-init']) {
          var id = order.id;
          var _dir;
          for (var i = 0; i < 1000; i++) {
            if(id > i*1000) {
              _dir = `${(i)*1000}-${(i+1)*1000}`;
            }
          }
          var dir = await mkdirp(`./static/files/${_dir}/${order.id}`);
          req.files['file-init'].mv(`./static/files/${_dir}/${order.id}/${req.files['file-init'].name}`, function(err) {
            if (err) {
              logger.error(err);
              return res.status(500).send(err);
            }
          });
          order.info['file-init'] = `${req.files['file-init'].name}`;
          await order.save()
        }

        if(order.status == 'client-notify') {
            var id = order.id;
            var _dir;
            for (var i = 0; i < 1000; i++) {
                if(id > i*1000) {
                    _dir = `${(i)*1000}-${(i+1)*1000}`;
                }
            }
            // if(!req.files.order) {
            //     res.status(400).send({errText: 'Договор - обязателен!'})
            //     return;
            // }
            // if(!reqData['date-sign']) {
            //     res.status(400).send({errText: 'Дата подписания - обязательна!'})
            //     return;
            // }
            var date = helper.parseDate(reqData['date-sign'])
            if(!date) {
                res.status(400).send({errText: 'Неверный формат даты'})
                return;
            }
            if(req.files.order) {
              var dir = await mkdirp(`./static/files/${_dir}/${order.id}`);
              req.files.order.mv(`./static/files/${_dir}/${order.id}/${req.files.order.name}`, function(err) {
                  if (err) {
                      logger.error(err);
                      return res.status(500).send(err);
                  }
              });
              order.info.order = `${req.files.order.name}`;
            }
            order.info['date-sign'] = date;
            order.status = 'succes';
            order.date['client-notify'] = new Date();
            order.deadline = null;

            order.history.push(helper.historyGenerator('client-notify', res.locals.__user));

            var done = await order.save();
            if(done) {
                // notify.create(res.locals.__user,er.id, `end-client-notify`);
                // done = await done.deepPopulate(populateQuery);
                // sendMail(done, 'new-status');
                logger.info(`End client-notify order #${ done.id }`, res.locals.__user);
                res.status(200).send({created: true});
                return;
            } else res.status(400).send({errText: 'Что-то пошло не так'})
        }

        if(order.status == 'client-match') {
            var mustIDOSS = (['internet', 'cloud', 'phone', 'wifi', 'iptv'].indexOf(order.info.service) >= 0);

            if(mustIDOSS && !reqData.idoss) {
                res.status(400).send({errText: 'Укажите ID OSS'});
                return;
            }
            if(reqData['income-once'] == '' || reqData['income-once'] == null) {
                res.status(400).send({errText: 'Укажите доход!'});
                return;
            }

            if(reqData['income-monthly'] == '' || reqData['income-once'] == null) {
                res.status(400).send({errText: 'Укажите доход!'});
                return;
            }

            order.info['idoss'] = reqData['idoss'];
            order.info['income-once'] = reqData['income-once'];
            order.info['income-monthly'] = reqData['income-monthly'];

            var done = await order.save();
            if(done) {
                logger.info(`Filling income order #${ done.id }`, res.locals.__user);
                res.status(200).send({created: true});
                return;
            } else {
              res.status(400).send({errText: 'Что-то пошло не так'})
              return;
            }
        }
        res.status(200).send({created: true});
        return;
    },

    getStat: async (req, res) => {
        var preQuery =[
            {status: 'gzp-pre'},
            {status: 'stop-pre'},
            {status: 'all-pre'},
            {status: 'sks-pre'},
            {status: 'client-match'}
        ]

        var buildQuery = [
            {status: 'gzp-build'},
            {status: 'stop-build'},
            {status: 'sks-build'},
            {status: 'install-devices'},
            {status: 'client-notify'},
            {status: 'network'}
        ];

        var deadlineQuery = {$or: [
            {$and: [
                { deadline: {'$lte': new Date()} },
                { "pause.status": {$ne: true} }
            ]},
            {$where: "this.pause && this.deadline < this.pause.date"}
        ]};

        var counter = {
            all: await Order.count({status: {$ne: 'secret'}}),
            succes: await Order.count({status: 'succes'}),
            reject: await Order.count({status: 'reject'}),
            pre: await Order.count({
                $or: preQuery
            }),
            build: await Order.count({
                $or: buildQuery
            }),
            'pre-deadline': await Order.count({
                $and: [
                    deadlineQuery,
                    {$or: preQuery}
                ]
            }),
            'build-deadline': await Order.count({
                $and: [
                    deadlineQuery,
                    {$or: buildQuery}
                ]
            })
        };

        var deps = await Department.find({
            $and: [
                {type: {$ne: 'admin'}},
                {type: {$ne: 'man'}}
            ]
        }).lean();

        for (var i = 0; i < deps.length; i++) {
            switch (deps[i].type) {
                case 'gus':
                    counter[deps[i]._id] = {
                        pre: await Order.count({
                            $or: [
                                {status: 'gzp-pre', 'info.city': deps[i].cities, 'special': null},
                                {status: 'all-pre', 'info.city': deps[i].cities, 'special': null},
                                {status: 'gzp-pre', 'special': deps[i]._id},
                                {status: 'all-pre', 'special': deps[i]._id}
                            ]
                        }),
                        build: await Order.count({
                            $or: [
                                {status: 'gzp-build', 'info.city': deps[i].cities, 'special': null},
                                {status: 'install-devices', 'info.city': deps[i].cities,  'special': null},
                                {status: 'gzp-build', 'special': deps[i]._id},
                                {status: 'install-devices', 'special': deps[i]._id}
                            ]
                        }),
                        'pre-deadline': await Order.count({
                            $and: [
                                {$or: [
                                    {status: 'gzp-pre', 'info.city': deps[i].cities, 'special': null},
                                    {status: 'all-pre', 'info.city': deps[i].cities, 'special': null},
                                    {status: 'gzp-pre', 'special': deps[i]._id},
                                    {status: 'all-pre', 'special': deps[i]._id}
                                ]},
                                deadlineQuery
                            ]
                        }),
                        'build-deadline': await Order.count({
                            $and: [
                                {$or: [
                                    {status: 'gzp-build', 'info.city': deps[i].cities, 'special': null},
                                    {status: 'install-devices', 'info.city': deps[i].cities,  'special': null},
                                    {status: 'gzp-build', 'special': deps[i]._id},
                                    {status: 'install-devices', 'special': deps[i]._id}
                                ]},
                                deadlineQuery
                            ]
                        })
                    }
                    break;
                case 'b2b':
                    counter[deps[i]._id] = {
                        pre: await Order.count({
                            $or: [
                                {status: 'client-match'}
                            ],
                            'info.department': deps[i]._id
                        }),
                        build: await Order.count({
                            $or: [
                                {status: 'client-notify'}
                            ],
                            'info.department': deps[i]._id
                        }),
                        'pre-deadline': await Order.count({
                            $and: [
                                deadlineQuery,
                                {$or: [
                                    {status: 'client-match'}
                                ]},
                                {'info.department': deps[i]._id}
                            ]
                        }),
                        'build-deadline': await Order.count({
                            $and: [
                                deadlineQuery,
                                {$or: [
                                    {status: 'client-notify'}
                                ]},
                                {'info.department': deps[i]._id}
                            ]
                        })
                    }
                    break;
                case 'b2o':
                    counter[deps[i]._id] = {
                        pre: await Order.count({
                            $or: [
                                {
                                    $or: [
                                        {status: 'client-match'}
                                    ],
                                    'info.department': deps[i]._id
                                },
                                {status: 'all-pre'},
                                {status: 'stop-pre'}
                            ]
                        }),
                        build: await Order.count({
                            $or: [
                                {
                                    $or: [
                                        {status: 'client-notify'}
                                    ],
                                    'info.department': deps[i]._id
                                },
                                {status: 'stop-build'}
                            ]
                        }),
                        'pre-deadline': await Order.count({
                            $and: [
                                deadlineQuery,
                                {$or: [
                                    {
                                        $or: [
                                            {status: 'client-match'}
                                        ],
                                        'info.department': deps[i]._id
                                    },
                                    {status: 'all-pre'},
                                    {status: 'stop-pre'}
                                ]}
                            ]
                        }),
                        'build-deadline': await Order.count({
                            $and: [
                                deadlineQuery,
                                {$or: [
                                    {
                                        $or: [
                                            {status: 'client-notify'}
                                        ],
                                        'info.department': deps[i]._id
                                    },
                                    {status: 'stop-build'}
                                ]}
                            ]
                        })
                    }
                    break;
                case 'sks':
                    counter[deps[i]._id] = {
                        pre: await Order.count({
                            status: 'sks-pre'
                        }),
                        build: await Order.count({
                            status: 'sks-build'
                        }),
                        'pre-deadline': await Order.count({
                            $and: [
                                deadlineQuery,
                                {status: 'sks-pre'}
                            ]
                        }),
                        'build-deadline': await Order.count({
                            $and: [
                                deadlineQuery,
                                {status: 'sks-build'}
                            ]
                        })
                    }
                    break;
                case 'net':
                    counter[deps[i]._id] = {
                        build: await Order.count({
                            status: 'network'
                        }),
                        'build-deadline': await Order.count({
                            $and: [
                                deadlineQuery,
                                {status: 'network'}
                            ]
                        })
                    }
                    break;
            }
        }

        res.locals.deps = deps;
        res.locals.statistics = counter;
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

    setFlag: async (req, res) => {
        var flag = await Flag.findOne({user: res.locals.__user._id, order: req.params.id});
        if(!flag) {
            flag = new Flag({
                user: res.locals.__user._id,
                order: req.params.id
            });
        }
        flag.value = req.body.state;
        flag.save();
        res.send('ok');
    },

    changeRespDep: async (req, res) => {
        var data = req.body;

        var order = await Order.findOne({id: data.id}),
            department = await Department.findOne({name: data.department});

        if (order) {
            order.special = department._id;
            order.history.push(helper.historyGenerator('redirect', res.locals.__user, {
                department: department.name
            }));
            order.save();
            res.send('ok');
            return;
        }
        res.status(400);
        return;
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
        res.locals.data = await helper.getData(res);
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

        if(!req.query.sort) { req.query.sort = 'id'; req.query.value = -1 };

        if(req.query.sort)
            orders = helper.orderSort(orders, req.query.sort, req.query.value);

        orders = orders.slice((pageNumber - 1)*perPage, (pageNumber - 1)*perPage + perPage);

        var now = new Date();
        orders.forEach( item => {
            item.cs = helper.calculateCS(item);
            item.status = stages[item.status];
            item.initDate = helper.dateToStr(item.date.init)
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
