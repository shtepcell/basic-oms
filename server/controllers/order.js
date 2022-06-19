'use strict';
const Order = require('../models/Order');
const Static = require('../models/Static');
const Department = require('../models/Department');
const Account = require('../models/Account');
const Provider = require('../models/Provider');
const Flag = require('../models/Flag');
const notify = require('./notify');
const { getExcel, getReportExcel } = require('./export');
const { saveFile } = require('./file-manager');
const fs = require('fs');
const path = require('path');

const ClientType = require('../models/ClientType');

const { validateService } = require('./order-services');

const helper = require('./helper');
const validator = require('./validator');

const GZP = require('./order-gzp');

var stages = require('../common-data').stages;

var populateQuery = `info.initiator info.initiator.department info.client info.client.type info.city info.street stop.provider`;

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
const Render = require('../render');
const render = Render.render;

const logger = require('./logger');
const Settings = require('../models/Settings');
const { isAviableToCreatePriorityOrder } = require('./priority');

const isSKSPath = (order) => {
    return order.info.service === 'sks';
};

const isNetPath = (order) => {
    return ['wifi', 'wifiorg', 'sputnik', 'sopka'].includes(order.info.service);
};

const has = (value) => {
    return value !== '' || value !== null || value !== undefined;
}

const getStat = async () => {
    const startTime = Date.now();

    var preQuery = [
        { status: 'gzp-pre' },
        { status: 'stop-pre' },
        { status: 'all-pre' },
        { status: 'sks-pre' },
        { status: 'client-match' }
    ]

    var buildQuery = [
        { status: 'gzp-build' },
        { status: 'stop-build' },
        { status: 'sks-build' },
        { status: 'install-devices' },
        { status: 'client-notify' },
        { status: 'network' },
        { status: 'pre-shutdown' },
        { status: 'build-shutdown' },
        { status: 'pre-pause' }
    ];

    const today = new Date();
    today.setDate(today.getDate() - 1);

    var deadlineQuery = {
        deadline: { '$ne': null },
        $or: [
            {
                $and: [
                    { deadline: { '$lte': today } },
                    { "pause.status": { $ne: true } }
                ]
            },
            { $where: "this.pause && this.deadline < this.pause.date" }
        ]
    };

    var counter = {
        all: await Order.count({ status: { $ne: 'secret' } }),
        succes: await Order.count({ status: 'succes' }),
        reject: await Order.count({ status: 'reject' }),
        pre: await Order.count({
            $or: preQuery
        }),
        build: await Order.count({
            $or: buildQuery
        }),
        'pre-deadline': await Order.count({
            $and: [
                deadlineQuery,
                { $or: preQuery }
            ]
        }),
        'build-deadline': await Order.count({
            $and: [
                deadlineQuery,
                { $or: buildQuery }
            ]
        })
    };

    var deps = await Department.find({
        $and: [
            { type: { $ne: 'admin' } },
            { type: { $ne: 'man' } }
        ]
    }).lean();

    for (var i = 0; i < deps.length; i++) {
        switch (deps[i].type) {
            case 'gus':
                counter[deps[i]._id] = {
                    pre: await Order.count({
                        'info.service': { $ne: 'rrl' },
                        $or: [
                            { status: 'gzp-pre', 'info.city': deps[i].cities, 'special': null },
                            { status: 'all-pre', 'info.city': deps[i].cities, 'special': null },
                            { status: 'gzp-pre', 'special': deps[i]._id },
                            { status: 'all-pre', 'special': deps[i]._id }
                        ]
                    }),
                    build: await Order.count({
                        'info.service': { $ne: 'rrl' },
                        $or: [
                            { status: 'gzp-build', 'info.city': deps[i].cities, 'special': null },
                            { status: 'install-devices', 'info.city': deps[i].cities, 'special': null },
                            { status: 'gzp-build', 'special': deps[i]._id },
                            { status: 'install-devices', 'special': deps[i]._id },
                            { status: 'build-shutdown', 'info.city': deps[i].cities, 'special': null },
                            { status: 'build-shutdown', 'special': deps[i]._id },
                        ]
                    }),
                    'pre-deadline': await Order.count({
                        $and: [
                            {
                                'info.service': { $ne: 'rrl' },
                                $or: [
                                    { status: 'gzp-pre', 'info.city': deps[i].cities, 'special': null },
                                    { status: 'all-pre', 'info.city': deps[i].cities, 'special': null },
                                    { status: 'gzp-pre', 'special': deps[i]._id },
                                    { status: 'all-pre', 'special': deps[i]._id }
                                ]
                            },
                            deadlineQuery
                        ]
                    }),
                    'build-deadline': await Order.count({
                        $and: [
                            {
                                'info.service': { $ne: 'rrl' },
                                $or: [
                                    { status: 'gzp-build', 'info.city': deps[i].cities, 'special': null },
                                    { status: 'install-devices', 'info.city': deps[i].cities, 'special': null },
                                    { status: 'gzp-build', 'special': deps[i]._id },
                                    { status: 'install-devices', 'special': deps[i]._id },
                                    { status: 'build-shutdown', 'info.city': deps[i].cities, 'special': null },
                                    { status: 'build-shutdown', 'special': deps[i]._id },
                                ]
                            },
                            deadlineQuery
                        ]
                    })
                }
                break;
            case 'b2b':
                counter[deps[i]._id] = {
                    pre: await Order.count({
                        $or: [
                            { status: 'client-match' }
                        ],
                        'info.department': deps[i]._id
                    }),
                    build: await Order.count({
                        $or: [
                            { status: 'client-notify' }
                        ],
                        'info.department': deps[i]._id
                    }),
                    'pre-deadline': await Order.count({
                        $and: [
                            deadlineQuery,
                            {
                                $or: [
                                    { status: 'client-match' }
                                ]
                            },
                            { 'info.department': deps[i]._id }
                        ]
                    }),
                    'build-deadline': await Order.count({
                        $and: [
                            deadlineQuery,
                            {
                                $or: [
                                    { status: 'client-notify' }
                                ]
                            },
                            { 'info.department': deps[i]._id }
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
                                    { status: 'client-match' },
                                    { status: 'stop-shutdown' },
                                    { status: 'stop-pause' },
                                    { status: 'stop-continue' },
                                    { status: 'stop-change' }
                                ],
                                'info.department': deps[i]._id
                            },
                            { status: 'all-pre' },
                            { status: 'stop-pre' }
                        ]
                    }),
                    build: await Order.count({
                        $or: [
                            {
                                $or: [
                                    { status: 'client-notify' }
                                ],
                                'info.department': deps[i]._id
                            },
                            { status: 'stop-build' }
                        ]
                    }),
                    'pre-deadline': await Order.count({
                        $and: [
                            deadlineQuery,
                            {
                                $or: [
                                    {
                                        $or: [
                                            { status: 'client-match' }
                                        ],
                                        'info.department': deps[i]._id
                                    },
                                    { status: 'all-pre' },
                                    { status: 'stop-pre' }
                                ]
                            }
                        ]
                    }),
                    'build-deadline': await Order.count({
                        $and: [
                            deadlineQuery,
                            {
                                $or: [
                                    {
                                        $or: [
                                            { status: 'client-notify' }
                                        ],
                                        'info.department': deps[i]._id
                                    },
                                    { status: 'stop-build' }
                                ]
                            }
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
                            { status: 'sks-pre' }
                        ]
                    }),
                    'build-deadline': await Order.count({
                        $and: [
                            deadlineQuery,
                            { status: 'sks-build' }
                        ]
                    })
                }
                break;
            case 'net':
                counter[deps[i]._id] = {
                    build: await Order.count({
                        $or: [
                            { status: 'network' },
                            { status: 'pre-shutdown' },
                            { status: 'pre-pause' }
                        ]
                    }),
                    'build-deadline': await Order.count({
                        $and: [
                            deadlineQuery,
                            {
                                $or: [
                                    { status: 'network' },
                                    { status: 'pre-shutdown' },
                                    { status: 'pre-pause' }
                                ]
                            },
                        ]
                    })
                }
                break;
        }
    }

    return { deps, statistics: counter, ts: startTime, duration: Date.now() - startTime };
}

module.exports = {

    getPageInit: async (req, res) => {
        var rel = req.query.rel;
        var order = {};

        if (rel && !isNaN(rel)) {
            order = await Order.findOne({ id: rel }).populate([populateClient, populateCity, populateStreet]);
            if (order) {
                order = {
                    client: order.info.client.name,
                    contact: order.info.contact,
                    cms: order.info.cms,
                    'date-request': order.info['date-request'],
                    city: `${order.info.city.type} ${order.info.city.name}`,
                    street: order.info.street,
                    adds: order.info.adds,
                    coordinate: order.info.coordinate,
                    service: order.info.service,
                    ip: order.info.ip,
                    volume: order.info.volume,
                    add_info: order.info.add_info,
                    relation: order.id
                };
            }
        }

        render(req, res, {
            viewName: 'orders/init',
            options: {
                order: order
            }
        });
    },

    getMainPagePause: async (req, res) => {
        var pagerId = 'first',
            pagers = [],
            pageNumber = req.query['pager' + pagerId] || 1,
            perPage = res.locals.__user.settings.table.perPage || 25;
        res.locals.params = helper.trimObject(req.query);

        if (res.locals.params.id && isNaN(res.locals.params.id)) {
            res.locals.params.id_error = true;
        }

        if (!!(+pageNumber) && (+pageNumber) > 0) {
            pageNumber = +pageNumber;
            pagers[0] = pagerId;
        }
        else {
            res.redirect(req.path);
        }

        var query = {};
        var { query: subQ } = await helper.makeQuery(req, res);

        var user = res.locals.__user;

        var u = await Account.findOne({ login: user.login });
        u.last = '/pause';
        u.save();

        query = {
            'info.initiator': user._id,
            'requestPause.status': true
        };

        const total = await Order.get({ $and: [query, subQ] }).count();

        var orders = await Order.get({ $and: [query, subQ] })
            .populate([populateClient, populateCity, populateStreet])
            .skip((pageNumber - 1) * perPage)
            .limit(perPage)
            .sort({ [req.query.sort || 'id']: req.query.value || -1, pause: -1 })
            .lean();

        orders.forEach(item => {
            item.cs = helper.calculateCS(item);
            item.status = stages[item.status];
            item.initDate = helper.dateToStr(item.date.init)
        });

        if (!orders.length) {
            if (pageNumber !== 1) {
                res.redirect(req.path);
            } else {
                render(req, res, {
                    viewName: 'main',
                    options: {
                        tab: 'pause'
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
                    tab: 'pause'
                }
            });
        }
    },

    getMainPageClient: async (req, res) => {
        var pagerId = 'first',
            pagers = [],
            pageNumber = req.query['pager' + pagerId] || 1,
            perPage = res.locals.__user.settings.table.perPage || 25;
        res.locals.params = helper.trimObject(req.query);

        if (res.locals.params.id && isNaN(res.locals.params.id)) {
            res.locals.params.id_error = true;
        }

        if (!!(+pageNumber) && (+pageNumber) > 0) {
            pageNumber = +pageNumber;
            pagers[0] = pagerId;
        } else {
            return res.redirect(req.path);
        }

        var query = {};
        var { query: subQ } = await helper.makeQuery(req, res);

        var user = res.locals.__user;

        var u = await Account.findOne({ login: user.login });
        u.last = '/client';
        u.save();

        query = {
            'info.initiator': user._id,
            $or: [
                { status: 'client-match' },
                { status: 'client-notify' }
            ]
        };

        const total = await Order.get({ $and: [query, subQ] }).count();

        var orders = await Order.get({ $and: [query, subQ] })
            .populate([populateClient, populateCity, populateStreet])
            .skip((pageNumber - 1) * perPage)
            .limit(perPage)
            .sort({ [req.query.sort || 'id']: req.query.value || -1, pause: -1 })
            .lean();

        orders.forEach(item => {
            item.cs = helper.calculateCS(item);
            item.status = stages[item.status];
            item.initDate = helper.dateToStr(item.date.init)
        });

        if (!orders.length) {
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
        const { hasPrivateAccess } = res.locals;

        var pagerId = 'first',
            pagers = [],
            pageNumber = req.query['pager' + pagerId] || 1,
            perPage = res.locals.__user.settings.table.perPage || 25;
        res.locals.params = helper.trimObject(req.query);

        if (res.locals.params.id && isNaN(res.locals.params.id)) {
            res.locals.params.id_error = true;
        }

        if (!!(+pageNumber) && (+pageNumber) > 0) {
            pageNumber = +pageNumber;
            pagers[0] = pagerId;
        } else {
            return res.redirect(req.path);
        }

        var query = {};
        var { query: subQ } = await helper.makeQuery(req, res);

        var user = res.locals.__user;

        const u = await Account.findOne({ login: user.login });
        u.last = '/my';
        u.save();

        query = {
            'info.initiator': user._id,
            $and: [
                { status: { $ne: 'succes' } },
                { status: { $ne: 'reject' } },
                { status: { $ne: 'client-match' } },
                { status: { $ne: 'client-notify' } }
            ]
        };

        const total = await Order.get({ $and: [query, subQ] }, { private: hasPrivateAccess }).count();

        var orders = await Order.get({ $and: [query, subQ] }, { private: hasPrivateAccess })
            .populate([populateClient, populateCity, populateStreet])
            .skip((pageNumber - 1) * perPage)
            .limit(perPage)
            .sort({ [req.query.sort || 'id']: req.query.value || -1, pause: -1 })
            .lean();

        orders.forEach(item => {
            item.cs = helper.calculateCS(item);
            item.status = stages[item.status];
            item.initDate = helper.dateToStr(item.date.init)
        });

        if (!orders.length) {
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

        if (res.locals.params.id && isNaN(res.locals.params.id)) {
            res.locals.params.id_error = true;
        }

        if (!!(+pageNumber) && (+pageNumber) > 0) {
            pageNumber = +pageNumber;
            pagers[0] = pagerId;
        }
        else {
            res.redirect(req.path);
        }

        var query = {};
        var { query: subQ } = await helper.makeQuery(req, res);

        var user = res.locals.__user;

        var u = await Account.findOne({ login: user.login });
        u.last = '/pre';
        u.save();

        switch (user.department.type) {
            case 'b2o':
                query = {
                    $or: [
                        { status: 'stop-pre' },
                        { status: 'all-pre' }
                    ]
                };
                break;
            case 'gus':
                query = {
                    '$or': [
                        { status: 'gzp-pre', 'info.city': user.department.cities, special: null, 'info.service': { $ne: 'rrl' } },
                        { status: 'all-pre', 'info.city': user.department.cities, special: null },
                        { status: 'gzp-pre', 'special': user.department._id },
                        { status: 'all-pre', 'special': user.department._id }
                    ]
                }
                break;
            case 'rrl':
                query = {
                    '$or': [
                        { status: 'gzp-pre', 'info.service': 'rrl', special: null },
                        { status: 'gzp-pre', 'special': user.department._id },
                        { status: 'gzp-build', 'info.service': 'rrl', special: null },
                        { status: 'gzp-build', 'special': user.department._id },
                        { status: 'install-devices', 'info.service': 'rrl', special: null },
                        { status: 'install-devices', 'special': user.department._id },
                        { status: 'all-pre', 'special': user.department._id }
                    ]
                }
                break;
            case 'sks':
                query = {
                    '$or': [
                        { status: 'sks-pre' },
                        { special: user.department._id }
                    ]
                };
                break;
            case 'net':
                query = {
                    '$or': [
                        { status: 'pre', 'info.service': 'wifi' },
                        { status: 'pre', 'info.service': 'wifiorg' },
                        { status: 'pre', 'info.service': 'sputnik' },
                        { status: 'network' },
                        { status: 'pre-shutdown' },
                        { status: 'pre-pause' },
                        { status: 'pre-change' },
                        { status: 'pre-continue' },
                        { status: 'sks-pre' },
                        { status: 'sks-build' },
                    ]
                }
                break;
            case 'special':
                query = {
                    private: true,
                }
        }

        const total = await Order.get({ $and: [query, subQ] }).count();

        var orders = await Order.get({ $and: [query, subQ] })
            .populate([populateClient, populateCity, populateStreet])
            .skip((pageNumber - 1) * perPage)
            .limit(perPage)
            .sort({ [req.query.sort || 'id']: req.query.value || -1, pause: -1 })
            .lean();

        orders.forEach(item => {
            item.cs = helper.calculateCS(item);
            item.status = stages[item.status];
            item.initDate = helper.dateToStr(item.date.init)
        });

        if (!orders.length) {
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

        if (res.locals.params.id && isNaN(res.locals.params.id)) {
            res.locals.params.id_error = true;
        }

        if (!!(+pageNumber) && (+pageNumber) > 0) {
            pageNumber = +pageNumber;
            pagers[0] = pagerId;
        } else {
            return res.redirect(req.path);
        }

        var query = {};
        var { query: subQ } = await helper.makeQuery(req, res);

        var user = res.locals.__user;

        var u = await Account.findOne({ login: user.login });
        u.last = '/build';
        u.save();

        switch (user.department.type) {
            case 'b2o':
                query = {
                    '$or': [
                        { status: 'stop-build' },
                        { status: 'stop-shutdown' },
                        { status: 'stop-pause' },
                        { status: 'stop-change' },
                        { status: 'stop-continue' }
                    ]
                };
                break;
            case 'gus':
                query = {
                    '$or': [
                        { status: 'gzp-build', 'info.city': user.department.cities, special: null },
                        { status: 'install-devices', 'info.city': user.department.cities, special: null },
                        { status: 'build-shutdown', 'info.city': user.department.cities, special: null },
                        { status: 'gzp-build', special: user.department._id },
                        { status: 'install-devices', special: user.department._id },
                        { status: 'build-shutdown', special: user.department._id }
                    ]
                }
                break;
            case 'sks':
                query = {
                    '$or': [
                        { status: 'sks-build' },
                        { special: user.department._id }
                    ]
                };
                break;
        }

        const total = await Order.get({ $and: [query, subQ] }).count();

        var orders = await Order.get({ $and: [query, subQ] })
            .populate([populateClient, populateCity, populateStreet])
            .skip((pageNumber - 1) * perPage)
            .limit(perPage)
            .sort({ [req.query.sort || 'id']: req.query.value || -1, pause: -1 })
            .lean();

        orders.forEach(item => {
            item.cs = helper.calculateCS(item);
            item.status = stages[item.status];
            item.initDate = helper.dateToStr(item.date.init)
        });

        if (!orders.length) {
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

    init: async (req, res) => {
        const histories = [];
        var data = req.body;
        const isPrivate = res.locals.__user.department.type === 'special';

        Object.keys(data).forEach(item => {
            data[item] = data[item].trim();
            if (data[item] == '') data[item] = undefined;
        });

        data.initiator = res.locals.__user._id;
        data.department = res.locals.__user.department._id;

        var order = {
            status: data.pre,
            info: data,
            tech: {},
        };

        if (isPrivate) {
            order.special = data.department;
            order.tech.private = isPrivate;
        }

        var clnt = await validator.client(order.info.client);
        if (!clnt._id) {
            res.status(400).send({ errText: clnt });
            return;
        }
        order.info.client = clnt;

        if (!order.info.contact) {
            res.status(400).send({ errText: 'Укажите контактные данные клиента!' });
            return;
        }

        if (order.info['date-request']) {
            var date = helper.parseDate(order.info['date-request'])
            if (!date) {
                res.status(400).send({ errText: 'Неверный формат даты' })
                return;
            }
            order.info['date-request'] = date;
        }

        var city = await validator.city(order.info.city);
        if (!city._id) {
            res.status(400).send({ errText: city });
            return;
        }
        order.info.city = city;

        switch (req.body.adressType) {
            case 'location':
                var strt = await validator.street(order.info.street);
                if (!strt._id) {
                    res.status(400).send({ errText: strt });
                    return;
                }
                order.info.street = strt;

                if (!order.info.adds) {
                    res.status(400).send({ errText: 'Уточните адрес!' });
                    return;
                }
                break;
            case 'coordination':
                if (!order.info.coordinate) {
                    res.status(400).send({ errText: 'Укажите координаты!' });
                    return;
                }
                break;
        }

        if (!order.info.service) {
            res.status(400).send({ errText: 'Выберите услугу' });
            return;
        }

        const serviceInfo = validateService(order.info, req.files);

        if (order.info.service === 'wifi' && !order.info.idoss) {
            res.status(400).send({ errText: 'IDOSS – обязательное!' });
            return;
        }

        if (serviceInfo.error) {
            res.status(400).send({ errText: serviceInfo.error });
            return;
        }

        order.info.pre = undefined;
        order.info.adressType = undefined;

        var kk = {
            init: new Date()
        };

        if (isSKSPath(order)) order.status = 'sks-pre';

        if (isNetPath(order)) order.status = 'pre';

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
            case 'pre':
                kk['cs-sks-pre'] = deadline;
                break;
            case 'network':
                kk['cs-network'] = deadline;
                break;
        }

        if (order.status !== 'gzp-pre' && data.priority) {
            return res.status(400).send({ errText: 'Заявка может быть приоритетной только для ГЗП' });
        }

        if (data.priority) {
            const { status, gus } = await isAviableToCreatePriorityOrder(city._id);

            if (status === 'error') {
                return res.status(400).send({ errText: `Достигнуто максимальное кол-во активных приоритетных заказов (${gus.priorityCapacity}) для ${gus.name}` });
            }

            order.tech.priority = true;
        }

        var ordr = new Order({
            id: await Static.getOrderId(),
            status: order.status,
            deadline: deadline,
            info: order.info,
            date: kk,
            history: [helper.historyGenerator('init', res.locals.__user), ...histories],
            tech: order.tech,
            special: order.special,
        });

        if (req.files && req.files['file-init']) {
            ordr.info['file-init'] = saveFile(req.files['file-init']);
        }

        if (serviceInfo.mustUpload) {
            serviceInfo.mustUpload.forEach(item => {
                ordr.info[item] = saveFile(req.files[item]);
            })
        }

        var done = await ordr.save();

        if (done) {
            if (done.status == 'all-pre') {
                notify.create(res.locals.__user, done, 'start-gzp-pre');
                notify.create(res.locals.__user, done, 'start-stop-pre');
                // sendMail(done, 'new-status');

            } else {
                notify.create(res.locals.__user, done, `start-${done.status}`);
                done.status = stages[done.status];
                // sendMail(done, 'new-status');
            }

            logger.info(`Init Order #${done.id} | ${done.status} | ${done.info.client.name} | ${done.info.city.type} ${done.info.city.name}`, res.locals.__user);
            res.send({ created: true, id: done.id })
        } else res.send({ errText: 'Что-то пошло не так' });
    },

    getPageChange: async (req, res) => {
        if (isNaN(req.params.id)) {
            return render(req, res, { view: '404' });
        }

        var order = await Order.findOne({ id: req.params.id, status: { '$ne': 'secret' } }).deepPopulate(populateQuery);

        if (order) {
            if (order.status != 'succes') {
                return render(req, res, { view: '404' });
            }

            res.locals.order = order;
            return render(req, res, {
                viewName: 'orders/change-order'
            });

        } else {
            return render(req, res, { view: '404' });
        }
    },

    getChangeV: async (req, res) => {
        const order = await Order.findOne({ id: req.params.id });
        const { volume, cms } = req.body;

        order.history.push(helper.historyGenerator('change-order', res.locals.__user, {
            from: order.info.volume,
            to: volume,
            oldCms: order.info.cms || '',
            newCms: cms,
        }));

        if (order.date['stop-build'] != null) {
            order.status = 'stop-change';
            notify.create(res.locals.__user, order, `start-stop-change`);
            order.history.push(helper.historyGenerator('start-stop-change', res.locals.__user));
        } else {
            order.status = 'pre-change';
            notify.create(res.locals.__user, order, `start-pre-change`);
            order.history.push(helper.historyGenerator('start-pre-change', res.locals.__user));
        }
        order.deadline = await helper.calculateDeadline(3);

        order.info.cms = cms;
        order.preVolume = order.info.volume;
        order.info.volume = volume;
        order.wasChanged = true;
        order.save();

        res.sendStatus(200);
    },

    getOrderInfo: async (req, res) => {
        if (isNaN(req.params.id)) {
            render(req, res, { view: '404' });
            return;
        }
        var order = await Order.findOne({ id: req.params.id, status: { '$ne': 'secret' } }).deepPopulate(populateQuery);

        if (order) {
            res.locals.users = await Account
                .find({ status: true })
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
        if (isNaN(req.params.id)) {
            render(req, res, { view: '404' });
            return;
        }
        var order = await Order.findOne({ id: req.params.id, status: { '$ne': 'secret' } }).deepPopulate(populateQuery);

        const { data: autoDeadline } = await Settings.findOne({ type: 'auto-deadline' }).lean() || {};

        if (order) {
            autoDeadline && (order.autoDeadline = autoDeadline);

            res.locals.users = await Account
                .find({ status: true })
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
        if (isNaN(req.params.id)) {
            render(req, res, { view: '404' });
            return;
        }
        var order = await Order.findOne({ id: req.params.id, status: { '$ne': 'secret' } }).deepPopulate(populateQuery);
        const { data: autoDeadline } = await Settings.findOne({ type: 'auto-deadline' }).lean() || {};

        if (order) {
            autoDeadline && (order.autoDeadline = autoDeadline);

            res.locals.users = await Account
                .find({ status: true })
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
        if (isNaN(req.params.id)) {
            render(req, res, { view: '404' });
            return;
        }
        var order = await Order.findOne({ id: req.params.id, status: { '$ne': 'secret' } }).deepPopulate(populateQuery);
        const { data: autoDeadline } = await Settings.findOne({ type: 'auto-deadline' }).lean() || {};

        if (order) {
            autoDeadline && (order.autoDeadline = autoDeadline);

            res.locals.users = await Account
                .find({ status: true })
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
        if (isNaN(req.params.id)) {
            render(req, res, { view: '404' });
            return;
        }
        var order = await Order.findOne({ id: req.params.id, status: { '$ne': 'secret' } }).deepPopulate(populateQuery);

        if (order) {
            res.locals.users = await Account
                .find({ status: true })
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

    adminEdit: async (req, res) => {
        var data = req.body;

        var order = await Order.findOne({ id: req.params.id });

        order.isEditing = true;

        Object.keys(data).forEach(item => {
            if (item != 'adds') {
                data[item] = data[item].trim();
            }

            if (data[item] == '') {
                data[item] = undefined;
            }
        });

        switch (req.params.tab) {
            case 'info':
                var tmp = {};

                tmp = data;

                //Клиент
                var clnt = await validator.client(data.client);

                if (!clnt._id) {
                    res.status(400).send({ errText: clnt });
                    return;
                }
                tmp.client = clnt;

                // Услуга
                var service = data.service;
                tmp.service = service;

                const serviceInfo = validateService(tmp, req.files, order.info);

                if (serviceInfo.error) {
                    res.status(400).send({ errText: serviceInfo.error });
                    return;
                }

                serviceInfo.mustUpload.forEach(item => {
                    if (req.files[item]) {
                        tmp[item] = saveFile(req.files[item]);
                    }
                })

                // Координаты
                if (data.adressType === 'coordination') {
                    var coordinate = data.coordinate;

                    if (!coordinate) {
                        res.status(400).send({ errText: 'Укажите координаты' });
                        return;
                    }

                    tmp.coordinate = coordinate;
                    tmp.street = undefined;
                    tmp.adds = undefined;

                }

                // Улица
                if (data.adressType === 'location') {
                    if (!tmp.street || !tmp.adds) {
                        res.status(400).send({ errText: 'Укажите улицу и дом' });
                        return;
                    }

                    var strt = await validator.street(data.street);

                    if (!strt._id) {
                        res.status(400).send({ errText: 'Такой улицы нет в справочнике' });
                        return;
                    }

                    tmp.street = strt;
                    tmp.coordinate = undefined;
                }

                // Город
                var city = await validator.city(data.city);

                if (!city._id) {
                    res.status(400).send({ errText: city });
                    return;
                }
                tmp.city = city;

                if (data['date-sign']) {
                    var date = helper.parseDate(data['date-sign'])
                    if (date == 'err') {
                        res.status(400).send({ errText: 'Неверный формат даты' })
                        return;
                    }
                    tmp['date-sign'] = date;
                }

                if (req.files && req.files.order) {
                    order.info.order = saveFile(req.files.order);
                    await order.save();
                }

                if (req.files && req.files['file-init']) {
                    order.info['file-init'] = saveFile(req.files['file-init']);
                    await order.save()
                }

                order.info = Object.assign(order.info, tmp);
                break;

            case 'gzp':

                if (data.time && isNaN(data.time)) {
                    res.status(400).send({ errText: 'Срок организации должен быть числом' });
                    return;
                }

                order.gzp = Object.assign(order.gzp, data);
                break;

            case 'stop':

                if (data.time && isNaN(data.time)) {
                    res.status(400).send({ errText: 'Срок организации должен быть числом' });
                    return;
                }

                if (!data.provider) {
                    res.status(400).send({ errText: 'Провайдер - обязательное поле!' });
                    return;
                }

                var prvdr = helper.parseClient(data.provider);

                var provider = await Provider.findOne({ type: prvdr.type, name: prvdr.name });

                if (!provider) {
                    res.status(400).send({ errText: 'Такого провайдера не существует!' });
                    return;
                }
                data.provider = provider;
                order.stop = Object.assign(order.stop, data);
                break;
        }

        order.history.push(helper.historyGenerator('admin', res.locals.__user));
        notify.create(res.locals.__user, order, 'admin');
        var done = await order.save();
        if (done) {
            logger.info(`Admin edit order #${done.id}`, res.locals.__user);
            res.status(200).send({ url: `/order/${done.id}/${req.params.tab}` });
            return;
        } else {
            logger.error(`Admin edit error order #${done.id}`, res.locals.__user);
            res.status(400).send({ errText: 'Неизвестная ошибка!' });
            return;
        }
    },

    endPreSKS: async (req, res) => {
        var order = await Order.findOne({ id: req.params.id }).deepPopulate(populateQuery);
        const currentStatus = order.status;
        const { data: autoDeadline } = await Settings.findOne({ type: 'auto-deadline' }).lean() || {};

        if (order) {
            Object.keys(req.body).forEach(item => {
                req.body[item] = req.body[item].trim();
                if (req.body[item] == '') req.body[item] = undefined;
            });

            if (!autoDeadline && isNaN(req.body.time)) {
                res.status(400).send({ errText: 'Срок организации должен быть числом' });
                return;
            }

            if (!req.body['cost-once'] || !req.body['cost-monthly']) {
                res.status(400).send({ errText: 'Укажите стоимость организации' });
                return;
            }

            order.sks = {
                ...req.body,
                time: autoDeadline || req.body.time,
            };

            order.status = 'client-match';
            order.deadline = null;
            order.date['sks-pre'] = new Date();

            if (order.pause.status) {
                order.pause = {
                    status: false,
                    date: undefined
                };

                order.history.push(helper.historyGenerator('pause-stop', res.locals.__user));
            }

            order.history.push(helper.historyGenerator(currentStatus, res.locals.__user));
            var done = await order.save();
            if (done) {
                notify.create(res.locals.__user, done, `end-${currentStatus}`);

                logger.info(`Выполнена проработка #${done.id}`, res.locals.__user);
                res.status(200).send({ created: true })
            } else res.status(400).send({ errText: 'Что-то пошло не так!' });
        } else res.status(404);
    },

    endPreSTOP: async (req, res) => {
        var order = await Order.findOne({ id: req.params.id }).deepPopulate(populateQuery);
        const { data: autoDeadline } = await Settings.findOne({ type: 'auto-deadline' }).lean() || {};

        if (order) {
            Object.keys(req.body).forEach(item => {
                req.body[item] = req.body[item].trim();
                if (req.body[item] == '') req.body[item] = undefined;
            });

            order.stop = {
                ...req.body,
                time: autoDeadline || req.body.time,
            };
            if (req.body.capability == '1') {

                if (!req.body.provider) {
                    res.status(400).send({ errText: 'Провайдер - обязательное поле!' });
                    return;
                }

                var prvdr = helper.parseClient(req.body.provider);

                var provider = await Provider.findOne({ type: prvdr.type, name: prvdr.name });

                if (!provider) {
                    res.status(400).send({ errText: 'Такого провайдера не существует!' });
                    return;
                }

                order.stop.provider = provider;

                if (isNaN(req.body.time)) {
                    res.status(400).send({ errText: 'Срок организации должен быть числом' });
                    return;
                }

                if (!req.body['cost-once'] || !req.body['cost-monthly']) {
                    res.status(400).send({ errText: 'Укажите стоимость организации' });
                    return;
                }
            } else {

                if (!req.body.reason) {
                    res.status(400).send({ errText: 'Укажите причину' });
                    return;
                }
            }

            if (order.status == 'stop-pre') {
                order.status = 'client-match';
                order.deadline = null;
                // order.date['cs-client-match'] = await helper.calculateDeadline(10);
                order.date['stop-pre'] = new Date();
                order.stop.complete = true;
            }

            if (order.status == 'all-pre') {
                order.status = 'gzp-pre';
                order.date['stop-pre'] = new Date();
                order.stop.complete = true;
            }

            if (order.pause.status) {
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
            if (done) {
                notify.create(res.locals.__user, done, 'end-stop-pre');
                // done = await done.deepPopulate(populateQuery);
                // sendMail(done, 'new-status');
                logger.info(`End pre-stop order #${done.id}`, res.locals.__user);
                res.status(200).send({ created: true });
            } else res.status(400).send({ errText: 'Что-то пошло не так!' })
        } else res.status(404);
    },

    changeStatus: async (req, res) => {
        var reqData = req.body;
        const { incomeOnce, incomeMonth } = reqData;

        var order = await Order.findOne({ id: req.params.id, status: { '$ne': 'secret' } }).deepPopulate(populateQuery);

        if (!order) {
            res.status(400).send({ errText: 'Изменение несуществующей заявки!' });
            return;
        }

        if (order.pause.status && reqData.to != 'stop-pause') {
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

        const clientType = await ClientType.findById(order.info.client.type);

        switch (reqData.to) {
            case 'adminEdit':

                break;
            case 'pause':
                order.pause = {
                    status: true,
                    date: new Date()
                };
                order.requestPause = {
                    status: false,
                    date: null,
                    user: null
                };
                order.history.push(helper.historyGenerator('pause-start', res.locals.__user));
                // notify.create(res.locals.__user, order, 'pause-start');
                // sendMail(order, 'pause');
                break;
            case 'reject-pause':
                order.requestPause = {
                    status: false,
                    date: null,
                    user: null
                };
                order.history.push(helper.historyGenerator('reject-pause', res.locals.__user));
                // notify.create(res.locals.__user, order, 'reject-pause');
                break;
            case 'request-pause':
                order.requestPause = {
                    status: true,
                    date: new Date(),
                    user: res.locals.__user
                };
                order.history.push(helper.historyGenerator('request-pause', res.locals.__user));
                notify.create(res.locals.__user, order, 'request-pause');
                // sendMail(order, 'pause');
                break;
            case 'stop-pause':
                var now = new Date();
                var pause = order.pause.date;
                pause = Math.round((now - pause) / 1000 / 60 / 60 / 24);
                if (order.deadline) {
                    order.deadline = new Date(order.deadline.getFullYear(), order.deadline.getMonth(), order.deadline.getDate() + pause, 0, 0, 0, 0)
                }

                order.pause = {
                    status: false,
                    date: undefined
                };
                order.history.push(helper.historyGenerator('pause-stop', res.locals.__user));
                notify.create(res.locals.__user, order, 'pause-stop');
                break;
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
                order.preVolume = null;
                order.deadline = await helper.calculateDeadline(2);
                order.date['cs-client-notify'] = await helper.calculateDeadline(2);
                order.date['network'] = new Date();
                order.history.push(helper.historyGenerator('network', res.locals.__user));
                notify.create(res.locals.__user, order, 'network');
                break;

            // **************     ОТКЛЮЧЕНИЕ СЕРВИСА     ***************

            case 'start-pre-shutdown':
                if (order.date['stop-build'] != null) {
                    order.status = 'stop-shutdown';
                    order.history.push(helper.historyGenerator('start-stop-shutdown', res.locals.__user));
                    notify.create(res.locals.__user, order, 'start-stop-shutdown');
                } else {
                    order.status = 'pre-shutdown';
                    order.history.push(helper.historyGenerator('start-pre-shutdown', res.locals.__user));
                    notify.create(res.locals.__user, order, 'start-pre-shutdown');
                }
                order.info.contact = reqData.contact;
                order.deadline = await helper.calculateDeadline(3);
                break;
            case 'start-gzp-shutdown':
                order.status = 'build-shutdown';
                order.deadline = null;
                order.date['pre-shutdown'] = new Date();
                order.history.push(helper.historyGenerator('start-build-shutdown', res.locals.__user));
                notify.create(res.locals.__user, order, 'start-build-shutdown');
                break;
            case 'end-gzp-shutdown':
                order.status = 'shutdown';
                order.deadline = null;
                order.date['shutdown'] = new Date();
                order.history.push(helper.historyGenerator('shutdown', res.locals.__user));
                notify.create(res.locals.__user, order, 'shutdown');
                break;
            case 'end-shutdown':
                order.status = 'shutdown';
                order.deadline = null;
                order.date['pre-shutdown'] = new Date();
                order.date['shutdown'] = new Date();
                order.history.push(helper.historyGenerator('shutdown', res.locals.__user));
                notify.create(res.locals.__user, order, 'shutdown');
                break;
            case 'end-stop-shutdown':
                order.status = 'pre-shutdown';
                order.deadline = await helper.calculateDeadline(3);
                order.date['stop-shutdown'] = new Date();
                order.history.push(helper.historyGenerator('start-pre-shutdown', res.locals.__user));
                notify.create(res.locals.__user, order, 'start-pre-shutdown');
                break;

            // **************     ПРИОСТАНОВКА СЕРВИСА     ***************

            case 'start-pause-service':
                var isStop = '';
                if (order.date['stop-build'] != null) {
                    order.status = 'stop-pause';
                    isStop = 'stop-';
                } else {
                    order.status = 'pre-pause';
                }
                order.info.contact = reqData.contact;
                order.deadline = await helper.calculateDeadline(3);
                order.history.push(helper.historyGenerator(`start-${isStop}pause-service`, res.locals.__user));
                notify.create(res.locals.__user, order, `start-${isStop}pause-service`);
                break;
            case 'end-stop-pause':
                order.status = 'pre-pause';
                order.deadline = await helper.calculateDeadline(3);
                order.history.push(helper.historyGenerator(`start-pause-service`, res.locals.__user));
                notify.create(res.locals.__user, order, `start-pause-service`);
                break;
            case 'pause-service':
                order.status = 'pause';
                order.deadline = null;
                order.date['pre-pause'] = new Date();
                order.history.push(helper.historyGenerator('pause-service', res.locals.__user));
                notify.create(res.locals.__user, order, 'pause-service');
                break;

            // **************     ВОЗОБНОВЛЕНИЕ СЕРВИСА     ***************

            case 'start-continue':
                if (order.date['stop-build'] != null) {
                    order.status = 'stop-continue';
                    order.history.push(helper.historyGenerator(`start-stop-continue`, res.locals.__user));
                    notify.create(res.locals.__user, order, `start-stop-continue`);
                } else {
                    order.status = 'pre-continue';
                    order.history.push(helper.historyGenerator(`start-pre-continue`, res.locals.__user));
                    notify.create(res.locals.__user, order, `start-pre-continue`);
                }
                order.deadline = await helper.calculateDeadline(3);
                break;
            case 'end-stop-continue':
                order.status = 'pre-continue';
                order.deadline = await helper.calculateDeadline(3);
                order.history.push(helper.historyGenerator(`start-pre-continue`, res.locals.__user));
                notify.create(res.locals.__user, order, `start-pre-continue`);
                break;
            case 'end-pre-continue':
                order.status = 'continue';
                order.deadline = null;
                order.history.push(helper.historyGenerator(`start-continue`, res.locals.__user));
                notify.create(res.locals.__user, order, `start-continue`);
                break;
            case 'end-continue':
                order.status = 'succes';
                order.deadline = null;
                order.history.push(helper.historyGenerator(`end-continue`, res.locals.__user));
                break;


            // **************     ИЗМЕНЕНИЯ СЕРВИСА     ***************

            case 'end-stop-change':
                order.status = 'pre-change';
                order.deadline = await helper.calculateDeadline(3);
                order.history.push(helper.historyGenerator(`start-pre-change`, res.locals.__user));
                notify.create(res.locals.__user, order, `start-pre-change`);
                break;
            case 'end-pre-change':
                order.status = 'change';
                order.deadline = null;
                order.history.push(helper.historyGenerator(`start-change`, res.locals.__user));
                notify.create(res.locals.__user, order, `start-change`);
                break;
            case 'end-change':
                order.status = 'succes';
                order.deadline = null;
                order.history.push(helper.historyGenerator(`end-change`, res.locals.__user));
                break;

            case 'end-sks-build':
                order.status = 'network';
                order.date['sks-build'] = new Date();
                order.history.push(helper.historyGenerator('sks-build', res.locals.__user));
                notify.create(res.locals.__user, order, 'sks-gzp-build');
                break;
            case 'start-gzp-build':
                if (order.gzp.need) {
                    order.status = 'gzp-build';
                } else {
                    order.status = 'install-devices';
                }
                order.info['income-once'] = reqData.incomeOnce;
                order.info['income-monthly'] = reqData.incomeMonth;
                if (reqData.oss) { order.info['idoss'] = reqData.oss; }

                order.deadline = await helper.calculateDeadline(order.gzp.time);
                order.date['cs-gzp-organization'] = await helper.calculateDeadline(order.gzp.time);
                order.date['client-match'] = new Date();

                order.history.push(helper.historyGenerator('client-match', res.locals.__user));
                notify.create(res.locals.__user, order, `start-${order.status}`);
                break;
            case 'start-sks-build':
                order.status = 'sks-build';

                order.info['income-once'] = reqData.incomeOnce;
                order.info['income-monthly'] = reqData.incomeMonth;
                if (reqData.oss) { order.info['idoss'] = reqData.oss; }

                order.deadline = await helper.calculateDeadline(order.sks.time);
                order.date['cs-sks-organization'] = await helper.calculateDeadline(order.sks.time);
                order.date['client-match'] = new Date();
                order.history.push(helper.historyGenerator('client-match', res.locals.__user));
                notify.create(res.locals.__user, order, `start-sks-build`);
                break;
            case 'end-install-devices':

                if (clientType.shortName == 'SOHO' || order.info.service == "sks" || order.info.service == "devices" || order.info.service == "rrl") {
                    order.status = 'client-notify';
                } else {
                    order.status = 'network';
                    order.history.push(helper.historyGenerator('install-devices', res.locals.__user));
                    notify.create(res.locals.__user, order, `end-install-devices`);
                }
                order.date['gzp-build'] = new Date();
                break;
            case 'start-stop-build':
                order.status = 'stop-build';

                order.info['income-once'] = reqData.incomeOnce;
                order.info['income-monthly'] = reqData.incomeMonth;
                if (reqData.oss) { order.info['idoss'] = reqData.oss; }

                order.deadline = await helper.calculateDeadline(order.stop.time);
                order.date['cs-stop-organization'] = await helper.calculateDeadline(order.stop.time);
                order.date['client-match'] = new Date();
                order.history.push(helper.historyGenerator('client-match', res.locals.__user));
                notify.create(res.locals.__user, order, `start-stop-build`);
                break;
            case 'end-build-stop':
                if (clientType.shortName == 'SOHO' || order.info.service == "sks" || order.info.service == "devices" || order.info.service == "rrl") {
                    order.status = 'client-notify';
                } else {
                    order.status = 'network';
                }
                order.date['stop-build'] = new Date();
                order.history.push(helper.historyGenerator('stop-build', res.locals.__user));
                notify.create(res.locals.__user, order, `end-stop-build`);
                break;
            case 'comeback':
                if (order.date['gzp-build']) {
                    if (order.gzp.need) {
                        order.status = 'gzp-build';
                        notify.create(res.locals.__user, order, `start-gzp-build`);
                    } else {
                        order.status = 'install-devices';
                        notify.create(res.locals.__user, order, `start-install-devices`);
                    }
                } else {
                    if (order.date['install-devices']) {
                        order.status = 'install-devices';
                        notify.create(res.locals.__user, order, `start-install-devices`);
                    }
                }

                if (order.date['stop-build']) {
                    order.status = 'stop-build';
                    notify.create(res.locals.__user, order, `start-stop-build`);
                }
                if (order.date['sks-build']) {
                    order.status = 'sks-build';
                    notify.create(res.locals.__user, order, `start-sks-build`);
                }
                order.history.push(helper.historyGenerator('comeback', res.locals.__user));
                break;
            case 'back':
                switch (order.status) {
                    case 'build-shutdown':
                        order.status = 'pre-shutdown';
                        break;
                    case 'pre-shutdown':
                    case 'pre-pause':
                        order.status = 'succes';
                        break;
                    case 'network':
                        isNetPath(order) && (order.status = 'client-match');
                        break;
                }
                order.history.push(helper.historyGenerator('back', res.locals.__user));
                break;
            case 'start-network':
                order.status = 'network';
                order.info['income-once'] = incomeOnce || order.info['income-once'];
                order.info['income-monthly'] = incomeMonth || order.info['income-once'];

                let organizationTime = 3;

                if (isNetPath(order) && order.sks && order.sks.time) {
                    organizationTime = order.sks.time;
                }

                order.deadline = order.date['cs-network'] = await helper.calculateDeadline(organizationTime);
                order.history.push(helper.historyGenerator('start-network', res.locals.__user));

                break;
        }

        var done = await order.save();
        if (done) {
            logger.info(`${reqData.to} order #${done.id}`, res.locals.__user);
            if (reqData.to == 'delete') return res.status(200).send({ url: '/' });
            if (reqData.to == 'adminEdit') res.status(200).send({ url: `/order/${done.id}/info/admin` });

            else res.status(200).send({ created: true });
        } else res.status(400).send({ errText: 'Изменение несуществующей заявки!' });

    },

    postGzp: async function (req, res) {
        var order = await Order.findOne({ id: req.params.id }).populate(populateQuery);

        if (order.status == 'gzp-pre' || order.status == 'all-pre') {
            return GZP.endPreGZP(req, res, order);
        }

        if (order.status == 'gzp-build' || order.status == 'install-devices') {
            return GZP.endBuild(req, res, order);
        }
    },

    endClientNotify: async (req, res) => {
        var reqData = req.body;
        var order = await Order.findOne({ id: req.params.id }).populate(populateClient);

        order.isEditing = true;

        if (!order) {
            res.status(400).send({ errText: 'Ошибка при сохранении!' });
            return;
        }

        if (!req.body['date-request']) {
            order.info['date-request'] = undefined;
            await order.save()
        } else {
            var date = helper.parseDate(req.body['date-request'])
            if (!date || date == 'Invalid Date') {
                res.status(400).send({ errText: 'Неверный формат даты' })
                return;
            }

            req.body['date-request'] = date;
            order.info['date-request'] = date;
            await order.save()
        }

        if (req.body.service) {
            var ser = req.body.service;

            var needNotify = (ser != order.info.service);

            const serviceInfo = validateService(req.body, req.files, order.info);

            if (serviceInfo.error) {
                res.status(400).send({ errText: serviceInfo.error });
                return;
            }

            Object.assign(order.info, req.body);

            serviceInfo.mustUpload.forEach(item => {
                if (req.files[item]) {
                    order.info[item] = saveFile(req.files[item]);
                }
            })

            order.info.service = ser;

            if (needNotify) {
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

        if (req.files && req.files['file-init']) {
            order.info['file-init'] = saveFile(req.files['file-init']);
            await order.save();
        }

        if (order.status == 'client-notify') {
            order.isEditing = false;

            var date = helper.parseDate(reqData['date-sign'])
            if (!date) {
                res.status(400).send({ errText: 'Неверный формат даты' })
                return;
            }

            if (req.files && req.files.order) {
                order.info.order = saveFile(req.files.order);
            }

            order.info['date-sign'] = date;
            order.status = 'succes';
            order.date['client-notify'] = new Date();
            order.deadline = null;

            order.history.push(helper.historyGenerator('client-notify', res.locals.__user));

            var done = await order.save();
            if (done) {
                // notify.create(res.locals.__user,er.id, `end-client-notify`);
                // done = await done.deepPopulate(populateQuery);
                // sendMail(done, 'new-status');
                logger.info(`End client-notify order #${done.id}`, res.locals.__user);
                res.status(200).send({ created: true });
                return;
            } else res.status(400).send({ errText: 'Что-то пошло не так' })
        }

        if (order.status == 'client-match') {
            var mustIDOSS = (['internet', 'cloud', 'phone', 'wifi', 'iptv'].indexOf(order.info.service) >= 0);

            if (mustIDOSS && !reqData.idoss) {
                res.status(400).send({ errText: 'Укажите ID OSS' });
                return;
            }

            if (reqData['income-once'] == '' || reqData['income-once'] == null) {
                res.status(400).send({ errText: 'Укажите доход!' });
                return;
            }

            if (reqData['income-monthly'] == '' || reqData['income-once'] == null) {
                res.status(400).send({ errText: 'Укажите доход!' });
                return;
            }

            order.info['idoss'] = reqData['idoss'];
            order.info['income-once'] = reqData['income-once'];
            order.info['income-monthly'] = reqData['income-monthly'];

            var done = await order.save();
            if (done) {
                logger.info(`Filling income order #${done.id}`, res.locals.__user);
                res.status(200).send({ created: true });
                return;
            } else {
                res.status(400).send({ errText: 'Что-то пошло не так' })
                return;
            }
        }

        res.status(200).send({ created: true });
        return;
    },

    getStatPage: async (req, res) => {
        fs.readFile(path.resolve('cache/status.json'), (err, data) => {
            if (err) {
                return res.sendStatus(500);
            }

            try {
                const { deps, statistics, duration, ts } = JSON.parse(data);

                res.locals.deps = deps;
                res.locals.statistics = statistics;
                res.locals.duration = duration;
                res.locals.ts = ts;

                return render(req, res, {
                    viewName: 'status'
                });
            } catch (error) {
                console.error(error);
                return res.sendStatus(500);
            }

        });

    },

    getStat,

    setFlag: async (req, res) => {
        var flag = await Flag.findOne({ user: res.locals.__user._id, order: req.params.id });
        if (!flag) {
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

        var order = await Order.findOne({ id: data.id }),
            department = await Department.findOne({ name: data.department });

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

    changeStage: async (req, res) => {
        var data = req.body;

        var order = await Order.findOne({ id: data.id }),
            user = res.locals.__user;

        var hist = {
            author: `[${user.department.name}] ${user.name}`,
            date: new Date()
        };

        switch (data.stage) {
            case 'gzp-pre':
                order.status = 'gzp-pre';
                var deadline = await helper.calculateDeadline(3);
                order.deadline = deadline;
                order.date['cs-gzp-pre'] = deadline;
                hist.name = 'Изменен этап -> Проработка ГЗП'
                break;

            case 'stop-pre':
                order.status = 'stop-pre';
                var deadline = await helper.calculateDeadline(3);
                order.deadline = deadline;
                order.date['cs-stop-pre'] = deadline;
                hist.name = 'Изменен этап -> Проработка СТОП'
                break;

            case 'all-pre':
                order.status = 'all-pre';
                var deadline = await helper.calculateDeadline(3);
                order.deadline = deadline;
                order.date['cs-stop-pre'] = deadline;
                order.date['cs-gzp-pre'] = deadline;
                hist.name = 'Изменен этап -> Проработка ГЗП и СТОП'
                break;

            case 'pre':
                order.status = 'pre';
                var deadline = await helper.calculateDeadline(3);
                order.deadline = deadline;
                order.date['cs-gzp-pre'] = deadline;
                hist.name = 'Изменен этап -> Проработка'
                break;

            case 'sks-pre':
                order.status = 'sks-pre';
                var deadline = await helper.calculateDeadline(3);
                order.deadline = deadline;
                order.date['cs-sks-pre'] = deadline;
                hist.name = 'Изменен этап -> Проработка СКС'
                break;

            case 'gzp-build':
                if (order.gzp && order.gzp.time) {
                    order.status = 'gzp-build';
                    var deadline = await helper.calculateDeadline(order.gzp.time);
                    order.deadline = deadline;
                    order.date['cs-gzp-organization'] = deadline;
                    hist.name = 'Изменен этап -> Организация ГЗП'
                } else {
                    res.send({ error: 'Сначала заказ нужно проработать!' })
                    return;
                }
                break;

            case 'stop-build':
                if (order.stop && order.stop.time) {
                    order.status = 'stop-build';
                    var deadline = await helper.calculateDeadline(order.stop.time);
                    order.deadline = deadline;
                    order.date['cs-stop-organization'] = deadline;
                    hist.name = 'Изменен этап -> Организация СТОП'
                } else {
                    res.send({ error: 'Сначала заказ нужно проработать!' })
                    return;
                }
                break;

            case 'sks-build':
                if (order.sks && order.sks.time || order.gzp && order.gzp.time) {
                    order.status = 'sks-build';
                    var deadline = await helper.calculateDeadline(order.sks.time || order.sks.time);
                    order.deadline = deadline;
                    order.date['cs-sks-build'] = deadline;
                    hist.name = 'Изменен этап -> Организация СКС'
                } else {
                    res.send({ error: 'Сначала заказ нужно проработать!' })
                    return;
                }
                break;
            case 'network':
                order.status = 'network';
                hist.name = 'Изменен этап -> Настройка сети'
                break;

            case 'client-match':
                order.status = 'client-match';
                var deadline = null;
                order.deadline = deadline;
                // order.date['cs-client-match'] = deadline;
                hist.name = 'Изменен этап -> Согласование с клиентом'
                break;

            case 'client-notify':
                order.status = 'client-notify';
                var deadline = null;
                order.deadline = deadline;
                order.date['cs-client-notify'] = deadline;
                hist.name = 'Изменен этап -> Уведомление клиента'
                break;

            case 'start-pre-shutdown':
                if (order.date['stop-build'] != null) {
                    order.status = 'stop-shutdown';
                } else {
                    order.status = 'pre-shutdown';
                }
                order.deadline = await helper.calculateDeadline(3);
                hist.name = 'Изменен этап -> Запрос отключения услуги'
                break;
        }
        order.history.push(hist);
        await order.save();

        res.send({ ok: 'ok' }).status(200);
        return;
    },

    searchReset: async (req, res) => {
        var usr = await Account.findOne({ _id: res.locals.__user._id });
        usr.settings.search.query = '/search';
        var done = await usr.save();
        if (done) {
            res.redirect('/search?');
            return;
        } else return;
    },

    excel: async (req, res) => {
        const { hasPrivateAccess } = res.locals;

        if (req.query.func && req.query.func.length == 1) req.query.func = [req.query.func]
        if (req.query.func1 && req.query.func1.length == 1) req.query.func1 = [req.query.func1]
        if (req.query.pre && req.query.pre.length == 1) req.query.pre = [req.query.pre]
        if (req.query.shutdown && req.query.shutdown.length == 1) req.query.shutdown = [req.query.shutdown]
        if (req.query.change && req.query.change.length == 1) req.query.change = [req.query.change]
        if (req.query.pauseService && req.query.pauseService.length == 1) req.query.pauseService = [req.query.pauseService]
        if (req.query.continue && req.query.continue.length == 1) req.query.continue = [req.query.continue]
        if (req.query.build && req.query.build.length == 1) req.query.build = [req.query.build]
        if (req.query.final && req.query.final.length == 1) req.query.final = [req.query.final]
        if (req.query.manager && req.query.manager.length == 1) req.query.manager = [req.query.manager]

        var { query, archive } = await helper.makeQuery(req, res);

        var orders = await Order.get(query, { archive, private: hasPrivateAccess }).populate([populateClient, populateCity, populateStreet, populateInitiator, populateProvider]).lean();

        orders.forEach(item => {
            item.status = stages[item.status];
            item.cs = helper.calculateCS(item);
        });

        getExcel(orders, res);
    },

    report: async (req, res) => {
        const { hasPrivateAccess } = res.locals;

        if (req.query.func && req.query.func.length == 1) req.query.func = [req.query.func]
        if (req.query.func1 && req.query.func1.length == 1) req.query.func1 = [req.query.func1]
        if (req.query.pre && req.query.pre.length == 1) req.query.pre = [req.query.pre]
        if (req.query.shutdown && req.query.shutdown.length == 1) req.query.shutdown = [req.query.shutdown]
        if (req.query.change && req.query.change.length == 1) req.query.change = [req.query.change]
        if (req.query.pauseService && req.query.pauseService.length == 1) req.query.pauseService = [req.query.pauseService]
        if (req.query.continue && req.query.continue.length == 1) req.query.continue = [req.query.continue]
        if (req.query.build && req.query.build.length == 1) req.query.build = [req.query.build]
        if (req.query.final && req.query.final.length == 1) req.query.final = [req.query.final]
        if (req.query.manager && req.query.manager.length == 1) req.query.manager = [req.query.manager]

        var { query, archive } = await helper.makeQuery(req, res);

        query.special = undefined;

        var orders = await Order.get(query, { archive, private: hasPrivateAccess }).populate([populateClient, populateCity, populateStreet, populateInitiator, populateProvider]).lean();

        for (let i = 0; i < orders.length; i++) {
            orders[i].gusName = await helper.getGUSName(orders[i]);
            orders[i].prosrochka = await helper.getEndGzpDeadline(orders[i]);
            let time = helper.calculatePauseTime(orders[i]);
            if (time > 0) {
                orders[i].pauseTime = time;
            } else orders[i].pauseTime = '-';
        }

        orders = orders.map(item => {
            return {
                ...item,
                status: stages[item.status],
                cs: helper.calculateCS(item),
            }
        });

        await getReportExcel(orders, res);
    },

    search: async (req, res) => {
        const { hasPrivateAccess } = res.locals;

        res.locals.data = await helper.getData(res);
        res.locals.data.hasPrivateAccess = res.locals.hasPrivateAccess;

        res.locals.err = {};

        if (req.query.func && req.query.func.length == 1) req.query.func = [req.query.func]
        if (req.query.func1 && req.query.func1.length == 1) req.query.func1 = [req.query.func1]
        if (req.query.pre && req.query.pre.length == 1) req.query.pre = [req.query.pre]
        if (req.query.shutdown && req.query.shutdown.length == 1) req.query.shutdown = [req.query.shutdown]
        if (req.query.change && req.query.change.length == 1) req.query.change = [req.query.change]
        if (req.query.pauseService && req.query.pauseService.length == 1) req.query.pauseService = [req.query.pauseService]
        if (req.query.continue && req.query.continue.length == 1) req.query.continue = [req.query.continue]
        if (req.query.build && req.query.build.length == 1) req.query.build = [req.query.build]
        if (req.query.final && req.query.final.length == 1) req.query.final = [req.query.final]
        if (req.query.manager && req.query.manager.length == 1) req.query.manager = [req.query.manager]

        var usr = await Account.findOne({ _id: res.locals.__user._id });

        if (Object.keys(req.query).length == 0) {
            if (usr.settings.search.query && usr.settings.search.query != req.originalUrl) {
                res.redirect(usr.settings.search.query);
                return;
            }
        }

        usr.settings.search.query = req.originalUrl;
        res.locals.query = req.query;
        usr.save();

        if (req.query.id && isNaN(req.query.id)) {
            res.locals.err.id = 'ID должен быть числом';
        }
        var { query, archive } = await helper.makeQuery(req, res);

        var pagerId = 'first',
            pagers = [],
            pageNumber = req.query['pager' + pagerId] || 1,
            perPage = res.locals.__user.settings.table.perPage || 25;

        if (!!(+pageNumber) && (+pageNumber) > 0) {
            pageNumber = +pageNumber;
            pagers[0] = pagerId;
        }
        else {
            res.redirect(req.path);
        }

        const total = await Order.get(query, { archive, private: hasPrivateAccess }).count();

        var orders = await Order.get(query, { archive, private: hasPrivateAccess })
            .populate([populateClient, populateCity, populateStreet])
            .skip((pageNumber - 1) * perPage)
            .limit(perPage)
            .sort({ [req.query.sort || 'id']: req.query.value || -1 })
            .lean();

        orders.forEach(item => {
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
    },

    api: {
        setPriority: async (req, res) => {
            const { priority } = req.body;

            if (priority === 'true') {
                const order = await Order.findOne({ id: req.params.id }).lean();

                const { status, gus } = await isAviableToCreatePriorityOrder(order.info.city);

                if (status === 'error') {
                    return res.status(400).send({ errText: `Достигнуто максимальное кол-во активных приоритетных заказов (${gus.priorityCapacity}) для ${gus.name}` });
                }
            }

            await Order.update({ id: req.params.id }, { $set: { 'tech.priority': priority } });

            return res.status(200).send({ status: 'ok' });
        }
    }
}
