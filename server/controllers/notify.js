const helper = require('./helper');
const Notify = require('../models/Notify');
const Account = require('../models/Account');
const Order = require('../models/Order');


const Render = require('../render'),
    render = Render.render;

const logger = require('./logger');

const events = require('../common-data').notifies;

// Есть три типа уведомлений:
// 1) Изменение состояния заказов - 'status'
// 2) Упоминания в чате = 'chat'
// 3) Broadcast-уведомления (обновление системы и др.) - 'Broadcast'

module.exports = {
    get: async (req, res) => {

        var orders = [],
            stages = [],
            status = 0,
            user = res.locals.__user,
            query = null;

        res.locals.notifies = [];

        switch (user.department.type) {
            case 'b2b':
                query = {'info.initiator': user._id};
                break;
            case 'b2o':
                query = {'info.initiator': user._id};
                stages = [
                    "start-stop-pre",
                    "start-stop-build"
                ];
                break;
            case 'net':
                stages = [
                    "end-stop-build",
                    'end-gzp-build',
                    'end-install-devices'
                ];
                break;
            case 'sks':
                stages = [
                    "start-sks-pre",
                    "start-sks-build"
                ];
                break;
            case 'gus':
                query = {'info.city': user.department.cities};
                stages = [
                    "start-gzp-pre",
                    "start-gzp-build"
                ];
                break;
        }

        if(query != null) {
            orders = await Order.find(query).lean();
            console.log(query);
        }

        orders = orders.map( item => {
            return {'order': item.id};
        })

        var forIO = orders.map( item => {
            return item.order;
        })

        if(stages.length > 0 && user.department.type != 'gus') {
            stages.forEach( it => {
                orders.push({ 'text': it })
            })
        }

        if(orders.length > 0) {
            if(user.department.type != 'gus')
                notifies = await Notify.find({
                    $or: [
                        {
                            $or: orders,
                            type: 'status',
                            initiator: {$ne: user.login}
                        },
                        {
                            recipients: user.login,
                            type: 'chat'
                        },
                        {
                            type: 'broadcast'
                        }
                    ]
                }).sort({'date': -1});
            else
                notifies = await Notify.find({
                    $or: [
                        {
                            $or: orders,
                            $or: [
                                {'text': 'start-gzp-pre'},
                                {'text': 'start-gzp-build'}
                            ],
                            type: 'status',
                            initiator: {$ne: user.login}
                        },
                        {
                            recipients: user.login,
                            type: 'chat'
                        },
                        {
                            type: 'broadcast'
                        }
                    ]
                }).sort({'date': -1});
        }

        else
            notifies = await Notify.find({
                $or: [
                    {
                        recipients: user.login,
                        type: 'chat'
                    },
                    {
                        type: 'broadcast'
                    }
                ]
            }).sort({'date': -1});


        if(notifies.length > 0) {
            res.locals.notifies = notifies.map( i => {
                i.text = events[i.text];

                if(i.read.indexOf(user._id) < 0) {
                    i.isNew = true;
                }

                return i;
            })
        }

        for (var i = 0; i < notifies.length; i++) {
            if (notifies[i].read.indexOf(user._id) < 0) {
                let ntf = await Notify.findOne({_id: notifies[i]._id});

                ntf.read.push(user._id);
                ntf.save();
            }
        }

        render(req, res, {
            viewName: 'notifies'
        });

    },

    create: async (io, user, id, text, recipients) => {
        var ntf;
        if(text == 'chat') {
            ntf = new Notify({
                order: id,
                type: 'chat',
                initiator: user.login,
                text: 'new-message',
                recipients: recipients,
                date: new Date()
            })
        } else {
            ntf = new Notify({
                order: id,
                initiator: user.login,
                type: 'status',
                text: text,
                date: new Date()
            })
        }
        var done = await ntf.save();

        io.emit('new notify', done);

    },

    read: async (id) => {
        var ntf = await Notify.findOne({_id: req.params.id});

        ntf.read.push(res.locals.__user);

        ntf.save();
    },

    countUnread: async (user) => {

        var orders = [],
            stages = [],
            status = 0,
            query = null;

        switch (user.department.type) {
            case 'b2b':
                query = {'info.initiator': user._id};
                break;
            case 'b2o':
                query = {'info.initiator': user._id};
                stages = [
                    "start-stop-pre",
                    "start-stop-build"
                ];
                break;
            case 'net':
                stages = [
                    "end-stop-build",
                    'end-gzp-build',
                    'end-install-devices'
                ];
                break;
            case 'sks':
                stages = [
                    "start-sks-pre",
                    "start-sks-build"
                ];
                break;
            case 'gus':
                query = {'info.city': user.department.cities};
                stages = [
                    "start-gzp-pre",
                    "start-gzp-build"
                ];
                break;
        }

        if(query != null) {
            orders = await Order.find(query).lean();
        }

        orders = orders.map( item => {
            return {'order': item.id};
        })

        var forIO = orders.map( item => {
            return item.order;
        })

        if(stages.length > 0) {
            stages.forEach( it => {
                orders.push({ 'text': it })
            })
        }

        if(orders.length > 0) {
            if(user.department.type != 'gus')
                status = await Notify.find({
                    $or: [
                        {
                            $or: orders,
                            type: 'status',
                            initiator: {$ne: user.login},
                            read: {$ne: user._id}
                        },
                        {
                            recipients: user.login,
                            type: 'chat',
                            read: {$ne: user._id}
                        },
                        {
                            type: 'broadcast',
                            read: {$ne: user._id}
                        }
                    ]
                }).count();
            else
                status = await Notify.find({
                    $or: [
                        {
                            $or: orders,
                            $or: [
                                {'text': 'start-gzp-pre'},
                                {'text': 'start-gzp-build'}
                            ],
                            type: 'status',
                            initiator: {$ne: user.login},
                            read: {$ne: user._id}
                        },
                        {
                            recipients: user.login,
                            type: 'chat',
                            read: {$ne: user._id}
                        },
                        {
                            type: 'broadcast',
                            read: {$ne: user._id}
                        }
                    ]
                }).count();
        }

        else
            status = await Notify.find({
                $or: [
                    {
                        recipients: user.login,
                        type: 'chat',
                        read: {$ne: user._id}
                    },
                    {
                        type: 'broadcast',
                        read: {$ne: user._id}
                    }
                ]
            }).count();

        return status;
    }

}
