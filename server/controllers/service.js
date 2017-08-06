'use strict';

const Service = require('../models/Service'),
    Render = require('../render'),
    render = Render.render;

const logger = require('./logger');

module.exports = {

    getPage: async (req, res) => {
        var pagerId = 'services',
            pagers = [],
            pageNumber = req.query['pager' + pagerId] || 1,
            perPage = 2; // TODO брать из конфига?

        if (!!(+pageNumber) && (+pageNumber) > 0) {
            pageNumber = +pageNumber;
            pagers[0] = pagerId;
        }
        else
            res.redirect(req.path);

        var services = await Service.paginate({}, { page: pageNumber, limit: perPage});

        if (!services.docs.length)
        {
            if (pageNumber !== 1) {
                res.redirect(req.path);
            } else {
                render(req, res, {
                    viewName: 'handbook',
                    options: {
                        title: 'Справочник услуг',
                        handbookType: 'services',
                        reqUrl: '/admin/services/add'
                    }
                });
            }
            return;
        }

        res.locals.services = services.docs;
        res.locals.pagers = {};
        res.locals.pagers[pagerId] = {
            pageNumber: +pageNumber,
            records: services.total,
            perPage: services.limit
        };
        render(req, res, {
            viewName: 'handbook',
            options: {
                title: 'Справочник услуг',
                handbookType: 'services',
                pagers: pagers,
                reqUrl: '/admin/services/add'
            }
        });
    },

    create: async (req, res) => {
        var obj = {
            name: req.body.name,
            type: req.body.type
        };

        var service = await Service.findOne({ name: obj.name, type: obj.type })

        var newService;

        if (service != null) {
            res.status(400).send({ errText: 'Услуга с таким названием уже есть в базе.' });
            return;
        }

        newService = new Service({
            name: obj.name,
            type: obj.type
        });

        var done = await saver(newService);
        if(!!done) {
            logger.info(`Created Service ${ done.type } ${ done.name } `, res.locals.__user);
            res.send({ created: true });
        } else res.status(400).send({ errText: `Произошла ошибка при сохранении.
            Попробуйте еще раз. При повторении этой ошибки - сообщите разработчику.`});

    },

    edit: async (req, res) => {
        var reqData = req.body;

        var service = await Service.findOne({ name: reqData.obj.name, type: reqData.obj.type})

        if (service != null) {
            res.status(400).send({ errText: 'Эта услуга уже есть в базе.' });
            return;
        }

        service = await Service.findOne({ _id: reqData.obj._id });

        if(service == null) {
            res.status(400).send({ errText: 'Невозможно изменить несуществующую услугу.' });
            return;
        }
        var oldService = {
            name: service.name,
            type: service.type
        };
        service.name = reqData.obj.name;
        service.type = reqData.obj.type;

        var done = await saver(service);
        if(!!done) {
            logger.info(`Edit Service [${ oldService.type }] ${ oldService.name } --> [${ done.type }] ${ done.name } `, res.locals.__user);
            res.send({ created: true });
        } else res.status(400).send({ errText: `Произошла ошибка при сохранении.
            Попробуйте еще раз. При повторении этой ошибки - сообщите разработчику.`});

    },
    delete: async (req, res) => {
        var service = await Service.findById(req.body.obj._id)

        if (service == null) {
            res.status(400).send({ errText: 'Невозможно удалить несуществующую услугу.' });
            return;
        }

        if (service.isUsed()) {
            res.status(400).send({ errText: 'Невозможно удалить услугу, использующуюся в системе.' });
            return;
        }

        var done;

        try {
            done = await service.remove();
        } catch (err) {
            done = false;
            logger.error(err.message);
        }

        if (!!done) {
            logger.info(`Delete Service ${ done.type } ${ done.name }`, res.locals.__user);
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
