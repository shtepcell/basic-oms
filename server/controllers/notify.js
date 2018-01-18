const common = require('./common');
const Notify = require('../models/Notify');
const Account = require('../models/Account');
const Order = require('../models/Order');


const Render = require('../render'),
    render = Render.render;

const logger = require('./logger');

var events = {
    'start-gzp-pre': 'Начат этап "Проработка по ГЗП"',
    'start-stop-pre': 'Начат этап "Проработка по СТОП/VSAT"',
    'start-gzp-build': 'Начат этап "Организация ГЗП"',
    'start-stop-build': 'Начат этап "Организация СТОП/VSAT"',
    'init-with-unknown-city': 'Инициирована новая заявка с новым городом',
    'end-gzp-pre': 'Завершен этап "Проработка по ГЗП"',
    'end-stop-pre': 'Завершен этап "Проработка по СТОП/VSAT"',
    'end-stop-build': 'Завершен этап "Организация СТОП/VSAT"',
    'end-gzp-build': 'Завершен этап "Организация ГЗП"',
    'end-client-notify': 'Завершен этап "Уведомление клиента"',
    'end-client-match': 'Завершен этап "Согласование с клиентом"',
    'end-install-devices': 'Завершен этап "Установка оборудования"',
    'network': 'Завершен этап "Настройка сети"',
    'reject': 'Заявка отклонена',
    'secret': 'Заявка удалена',
    'pause': 'Заявка поставлена на паузу',
    'end-pause': 'Заявка снята с паузы'
};

module.exports = {
    get: async (req, res) => {
        var acc = await Account.findOne({login: res.locals.__user.login});
        // var settings = acc.settings.notify;
        var myOrders = await Order.find(
            {'history.author': acc._id}
        );

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
                date: common.dateToExtStr(item.date),
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

    read: async (req, res) => {
        var ntf = await Notify.findOne({_id: req.params.id}).populate('order read');

        ntf.read.push(res.locals.__user);

        ntf.save();

        res.status(200).send({url: `/order/${ntf.order.id}`});
    },

    countUnread: async (user) => {
        var myOrders = await Order.find(
            {'history.author': user._id}
        );

        myOrders = myOrders.map( i => {
            return {'order': i._id};
        })

        var ntfs = [];

        if(myOrders.length > 0)
            ntfs = await Notify.find({
                '$or': myOrders,
                read: {$ne: user._id}
            }).count();

        // var ntfs = await Notify.find({read: {$ne: user._id}}).count();

        return ntfs;
    }
}
