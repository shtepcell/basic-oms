// const Order = require('../models/Order');
const helper = require('./helper');
const notify = require('./notify');
const logger = require('./logger');

module.exports = {
    endBuild: async (req, res, order) => {

        if (!req.body.odf || !req.body.node) {
            res.status(400).send({ errText: 'ODF и узел агрегации обязательны к заполнению!' });
            return;
        }

        order.gzp.odf = req.body.odf;
        order.gzp.node = req.body.node;
        order.date[order.status] = new Date();
        order.history.push(helper.historyGenerator(order.status, res.locals.__user));
        notify.create(res.locals.__user, order, `end-${order.status}`);

        if (order.info.service == "sks" || order.info.service == "devices" ||  order.info.service == "rrl") {
            order.status = 'client-notify';
        } else {
            order.status = 'network';
        }
        
        order.save();
        res.status(200).send({ created: true });
        return;
    },

    endPreGZP: async (req, res, order) => {
        if (order) {
            Object.keys(req.body).forEach(item => {
                req.body[item] = req.body[item].trim();
                if (req.body[item] == '') req.body[item] = undefined;
            });

            if (((req.body.need == '1' && req.body.capability == '1')
                || (req.body.need == '0')) && isNaN(req.body.time)) {
                res.status(400).send({ errText: 'Срок организации должен быть числом' });
                return;
            }

            if ((req.body.need == '1' && req.body.capability == '1') || (req.body.need == '0')) {

                if (!req.body['cost-once'] || !req.body['cost-monthly']) {
                    res.status(400).send({ errText: 'Укажите стоимость организации' });
                    return;
                }

            }

            if (req.body.need == '1' && req.body.capability == '0') {
                if (!req.body.reason) {
                    res.status(400).send({ errText: 'Укажите причину технической не возможности!' });
                    return;
                }
            }

            order.gzp = req.body;

            if (order.status == 'gzp-pre') {
                order.status = 'client-match';
                order.deadline = null;
                order.date['gzp-pre'] = new Date();
                // order.date['cs-client-match'] = await helper.calculateDeadline(10);
                order.gzp.complete = true;
            }

            if (order.status == 'all-pre') {
                order.status = 'stop-pre';
                order.date['gzp-pre'] = new Date();
                order.gzp.complete = true;
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

            order.history.push(helper.historyGenerator('gzp-pre', res.locals.__user));
            var done = await order.save();
            if (done) {
                notify.create(res.locals.__user, done, 'end-gzp-pre');
                // done = await done.deepPopulate(populateQuery);
                // sendMail(done, 'new-status');
                logger.info(`End pre-gzp order #${done.id}`, res.locals.__user);
                res.status(200).send({ created: true })
            } else res.status(400).send({ errText: 'Что-то пошло не так!' });
        } else res.status(404);
    }
}