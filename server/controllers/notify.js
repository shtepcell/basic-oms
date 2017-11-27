const common = require('./common');
const Notify = require('../models/Notify');
const Account = require('../models/Account');

const Render = require('../render'),
    render = Render.render;

const logger = require('./logger');

var events = {
    'start-gzp-pre': 'Начат этап "Проработка по ГЗП"',
    'start-stop-pre': 'Начат этап "Проработка по STOP/VSAT"',
    'start-gzp-build': 'Начат этап "Организация ГЗП"',
    'start-stop-build': 'Начат этап "Организация STOP/VSAT"',
    'init-with-unknown-city': 'Инициирована новая заявка с новым городом',
    'end-gzp-pre': 'Завершен этап "Проработка по ГЗП"',
    'end-stop-pre': 'Завершен этап "Проработка по STOP/VSAT"',
    'end-stop-build': 'Завершен этап "Организация STOP/VSAT"',
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
        var notifies = await Notify.find({}).sort({date: -1}).populate('order').limit(50);

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
        var ntfs = await Notify.find({read: {$ne: user._id}}).count();

        return ntfs;
    }
}
