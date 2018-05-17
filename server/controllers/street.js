'use strict';

const Street = require('../models/Street'),
    Render = require('../render'),
    render = Render.render;

const logger = require('./logger');

module.exports = {

    getPage: async (req, res) => {

        var pagerId = 'street',
            pagers = [],
            pageNumber = req.query['pager' + pagerId] || 1,
            perPage = 30; // TODO брать из конфига?

        if (!!(+pageNumber) && (+pageNumber) > 0) {
            pageNumber = +pageNumber;
            pagers[0] = pagerId;
        }
        else
            res.redirect(req.path);

        var street = await Street.paginate({}, { page: pageNumber, limit: perPage})

        if(req.query.name) {
            var val = req.query.name;
            val = val.replace(/\[/g, '');
            val = val.replace(/\]/g, '');
            val = val.replace(/\\/g, '');
            val = val.replace(/\(/g, '');
            val = val.replace(/\)/g, '');
            var rgx =  new RegExp('' + val + '', 'i');
            street = await Street.paginate({name: {$regex: rgx}}, { page: pageNumber, limit: perPage});
        }

        if(street.total == 0) street.total = 1;
        res.locals.query = req.query;
        res.locals.street = street.docs;
        res.locals.pagers = {};
        res.locals.pagers[pagerId] = {
            pageNumber: +pageNumber,
            records: street.total,
            perPage: street.limit
        };
        render(req, res, {
            viewName: 'handbook',
            options: {
                title: 'Справочник улиц',
                handbookType: 'street',
                pagers: pagers,
                reqUrl: '/admin/street/add'
            }
        });

    },

    create: async (req, res) => {
        var obj = {
            name: req.body.name.trim(),
            type: req.body.type
        };

        var street = await Street.findOne({ name: obj.name, type: obj.type })

        if (street != null) {
            res.status(400).send({ errText: 'Улица с таким названием уже есть в базе.' });
            return;
        }

        var newStreet = new Street({
            name: obj.name,
            type: obj.type
        });

        var done = await saver(newStreet);
        if(!!done) {
            logger.info(`Created Street ${ done.type } ${ done.name } `, res.locals.__user);
            res.send({ created: true });
        } else res.status(400).send({ errText: `Произошла ошибка при сохранении.
            Попробуйте еще раз. При повторении этой ошибки - сообщите разработчику.`});
    },

    edit: async (req, res) => {
        var reqData = req.body;

        var street = await Street.findOne({ name: reqData.obj.name.trim(), type: reqData.obj.type})

        if (street != null && street._id != reqData.obj._id ) {
            res.status(400).send({ errText: 'Улица с таким названием уже есть в базе.' });
            return;
        }

        street = await Street.findOne({ _id: reqData.obj._id});

        if(!street) {
            res.status(400).send({ errText: 'Попытка редактирования несуществующей улицы.' });
            return;
        }

        var oldStreet = { name: street.name, type: street.type };

        street.name = reqData.obj.name.trim();
        street.type = reqData.obj.type;

        var done = await saver(street);

        if(!!done) {
            logger.info(`Edit Street ${ oldStreet.type } ${ oldStreet.name } --> ${ done.type } ${ done.name } `, res.locals.__user);
            res.send({ created: true });
        } else res.status(400).send({ errText: `Произошла ошибка при сохранении.
            Попробуйте еще раз. При повторении этой ошибки - сообщите разработчику.`});

    },

    delete: async (req, res) => {

        var street = await Street.findById(req.body.obj._id);

        if (street == null) {
            res.status(400).send({ errText: 'Невозможно удалить несуществующую улицу.' });
            return;
        }

        if (street.isUsed()) {
            res.status(400).send({ errText: 'Невозможно удалить улицу, которая используется в системе.' });
            return;
        }
        var done;

        try {
            done = await street.remove();
        } catch (err) {
            done = false;
            logger.error(err.message);
        }

        if (!!done) {
            logger.info(`Delete Street ${ done.type } ${ done.name }`, res.locals.__user);
            res.send({ ok: 'ok' });
        } else {
            res.status(400).send({ errText: `Произошла ошибка при сохранении.
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
