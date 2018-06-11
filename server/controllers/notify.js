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
        var acc = await Account.findOne({login: res.locals.__user.login});
        // var settings = acc.settings.notify;
        var myOrders = await Order.find({
            'history.author': acc._id
        });

        myOrders = myOrders.map( i => {
            return {'order': i._id};
        })

        var notifies = [];

        if(myOrders.length > 0)
            var notifies = await Notify.find({
                '$or': myOrders
            }).sort({date: -1}).populate('order').limit(50);

        notifies = notifies.map( item => {
            return {
                id: item._id,
                date: helper.dateToExtStr(item.date),
                text: events[item.type],
                order: item.order.id,
                read: (item.read.indexOf(res.locals.__user._id+'') >= 0)
            }
        });

        res.locals.notifies = notifies;

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

    read: async (req, res) => {
        // var ntf = await Notify.findOne({_id: req.params.id}).populate('order read');
        //
        // ntf.read.push(res.locals.__user);
        //
        // ntf.save();
        //
        // res.status(200).send({url: `/order/${ntf.order.id}`});
    },

    countUnread: async (req, res) => {
        var user = res.locals.__user;

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
            status = await Notify.find({
                $or: orders,
                type: 'status',
                initiator: {$ne: user.login},
                read: {$ne: user._id}
            }).count()
        }

        var chat = await Notify.find({
            recipients: user.login,
            type: 'chat',
            read: {$ne: user._id}
        }).count();

        var broadcast = await Notify.find({
            type: 'broadcast',
            read: {$ne: user._id}
        }).count();

        res.send({count: status + chat + broadcast});
    }
}
