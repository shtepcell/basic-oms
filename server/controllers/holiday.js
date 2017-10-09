var Holiday = require('../models/Holiday');
var common = require('./common');

var Render = require('../render'),
    render = Render.render;

module.exports = {
    getAll: async (req, res) => {
        var holi = await Holiday.find().sort({date: 1});
        res.locals.holidays = holi;

        render(req, res, {
            viewName: 'holidays'
        });
    },

    add: async (req, res) => {
        var date = common.strToDate(req.body.date);
        if(!date) {
            res.status(400).send({errText: 'Выберите дату'});
            return;
        }
        var holi = await Holiday.findOne({date: date});

        if(!!holi) {
            res.status(400).send({errText: 'Этот выходной уже есть в списке'});
            return;
        }

        holi = new Holiday({
            date: date
        });
        var done = holi.save();

        if(!!done) {
            res.status(200).send({created: true});
            return;
        } else {
            res.status(400).send({errText: 'Что-то пошло не так'});
            return;
        }
    },

    delete: async (req, res) => {
        var date = common.strToDate(req.body.date);
        if(!date) {
            res.status(400).send({errText: 'Выберите дату'});
            return;
        }
        var holi = await Holiday.findOne({date: date});

        if(!holi) {
            res.status(400).send({errText: 'Этого выходного нет в списке'});
            return;
        }

        var done = await Holiday.remove({date: date});

        if(!!done) {
            res.status(200).send({created: true});
            return;
        } else {
            res.status(400).send({errText: 'Что-то пошло не так'});
            return;
        }
    }
};
