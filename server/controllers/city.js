'use strict';

const City = require('../models/City'),
    Order = require('../models/Order'),
    Department = require('../models/Department'),
    Render = require('../render'),
    render = Render.render;

const logger = require('./logger');

const alllowedUsageValues = ['true', 'false'];

module.exports = {

    getPage: async (req, res) => {

        var pagerId = 'cities',
            pagers = [],
            pageNumber = req.query['pager' + pagerId] || 1,
            perPage = 30; // TODO брать из конфига?

        if (!!(+pageNumber) && (+pageNumber) > 0) {
            pageNumber = +pageNumber;
            pagers[0] = pagerId;
        }
        else { res.redirect(req.path); }

        const baseQuery = {};

        const usage = { true: true, false: false }[req.query.usage];
        alllowedUsageValues.includes(req.query.usage) && (baseQuery.usage = usage);

        var cities = await City.paginate(baseQuery, { page: pageNumber, limit: perPage })

        if (req.query.name) {
            var val = req.query.name;
            val = val.replace(/\[/g, '');
            val = val.replace(/\]/g, '');
            val = val.replace(/\\/g, '');
            val = val.replace(/\(/g, '');
            val = val.replace(/\)/g, '');
            var rgx = new RegExp('' + val + '', 'i');
            cities = await City.paginate({ ...baseQuery, name: { $regex: rgx } }, { page: pageNumber, limit: perPage });
        }

        if (cities.total == 0) cities.total = 1;
        res.locals.query = req.query;
        res.locals.cities = cities.docs;
        res.locals.pagers = {};
        res.locals.pagers[pagerId] = {
            pageNumber: +pageNumber,
            records: cities.total,
            perPage: cities.limit
        };

        res.locals.usage = usage;

        render(req, res, {
            viewName: 'handbook',
            options: {
                title: 'Справочник городов',
                handbookType: 'cities',
                pagers: pagers,
                reqUrl: '/admin/cities/add'
            }
        });

    },

    create: async (req, res) => {
        var obj = {
            name: req.body.name.trim(),
            type: req.body.type
        };

        var city = await City.findOne({ name: obj.name, type: obj.type })

        if (city != null) {
            res.status(400).send({ errText: 'Город с таким названием уже есть в базе.' });
            return;
        }

        var newCity = new City({
            name: obj.name,
            type: obj.type
        });

        var done = await saver(newCity);
        if (done) {
            logger.info(`Created City ${done.type} ${done.name} `, res.locals.__user);
            res.send({ created: true });
        } else {
            res.status(400).send({
                errText: `Произошла ошибка при сохранении.
            Попробуйте еще раз. При повторении этой ошибки - сообщите разработчику.`});
        }
    },

    edit: async (req, res) => {
        var reqData = req.body;

        var city = await City.findOne({ name: reqData.obj.name.trim(), type: reqData.obj.type })

        if (city != null && city._id != reqData.obj._id) {
            res.status(400).send({ errText: 'Город с таким названием уже есть в базе.' });
            return;
        }

        city = await City.findOne({ _id: reqData.obj._id });

        if (!city) {
            res.status(400).send({ errText: 'Попытка редактирования несуществующего города.' });
            return;
        }

        var oldCity = { name: city.name, type: city.type };

        city.name = reqData.obj.name.trim();
        city.type = reqData.obj.type;

        var done = await saver(city);

        if (done) {
            logger.info(`Edit City ${oldCity.type} ${oldCity.name} --> ${done.type} ${done.name} `, res.locals.__user);
            res.send({ created: true });
        } else {
            res.status(400).send({
                errText: `Произошла ошибка при сохранении.
            Попробуйте еще раз. При повторении этой ошибки - сообщите разработчику.`});
        }

    },

    delete: async (req, res) => {

        var city = await City.findById(req.body.obj._id);
        var orders = await Order.find({ 'info.city': city }).lean();
        var deps = await Department.find({ 'cities': city }).lean();
        var used = (orders.length > 0 || deps.length > 0);

        if (city == null) {
            res.status(400).send({ errText: 'Невозможно удалить несуществующий город.' });
            return;
        }

        if (used) {
            res.status(400).send({ errText: 'Невозможно удалить город, использующийся в системе.' });
            return;
        }
        var done;

        try {
            done = await city.remove();
        } catch (err) {
            done = false;
            logger.error(err.message);
        }

        if (done) {
            logger.info(`Delete City ${done.type} ${done.name}`, res.locals.__user);
            res.send({ ok: 'ok' });
        } else {
            res.status(400).send({
                errText: `Произошла ошибка при сохранении.
                Попробуйте еще раз. При повторении этой ошибки - сообщите разработчику.`});
        }

    }
};

function saver(obj) {
    try {
        return obj.save();
    } catch (err) {
        logger.error(err.message);
        return false;
    }
}
