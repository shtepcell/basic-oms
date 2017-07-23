'use strict';

const Service = require('../models/Service'), 
    Render = require('../render'),
    render = Render.render;

module.exports = {
    getAll: function (req, res) {
        Service.find({}).then( services => {
            res.locals.services = services;
            render(req, res, {
                viewName: 'handbook',
                options: {
                    title: 'Справочник услуг',
                    handbookType: 'services',
                    reqUrl: '/admin/services/add'
                }
            });
        });
    },
    getPage: function (req, res) {
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

        Service.paginate({}, { page: pageNumber, limit: perPage})
            .then((services) => {
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
            })
            .catch((err) => {
                console.log('errr', err);
                // TODO: что делаем при ошибке?
            });
    },
    create: function (req, res) {
        var obj = {
                name: req.body.name,
                type: req.body.type
            };

        if (isErrorValidateService(obj.name, obj.type)) {
            res.status(400).send({ errText: 'Ошибка валидации' });
            return;
        }

        Service.findOne({ name: obj.name, type: obj.type })
            .then(service => {
                var newService;

                if (service != null) {
                    res.status(400).send({ errText: 'Услуга с таким названием уже есть в базе.' });
                    return;
                } 

                newService = new Service({
                    name: obj.name,
                    type: obj.type
                });
                return newService.save();
            })
            .then(() => {
                res.send({ created: true});
            });
    },
    edit: function (req, res) {
        var reqData = req.body;

        if (isErrorValidateService(reqData.obj.name, reqData.obj.type)) {
            res.status(400).send({ errText: 'Ошибка валидации' });
            return;
        }

        Service.findOne({ name: reqData.obj.name, type: reqData.obj.type})
            .then(service => {
                if (service != null) {
                    res.status(400).send({ errText: 'Услуга с таким названием уже есть в базе.' });
                    return;
                } 

                Service.findByIdAndUpdate(
                    reqData.obj._id,
                    { name: reqData.obj.name, type: reqData.obj.type},
                    function(err, service) {
                        if (err) return; //TODO что делаем при ошибке?
                        if (service == null) {
                            res.status(400).send({ errText: 'Невозможно изменить несуществующую услугу.' });
                        } else {
                            res.send({ ok: 'ok' });
                        }
                    });
            });
    },
    delete: function (req, res) {
        Service.findById(req.body.obj._id)
            .then(service => {
                if (service == null) {
                    res.status(400).send({ errText: 'Невозможно удалить несуществующую услугу.' });
                    return;
                }

                if (service.isUsed()) {
                    res.status(400).send({ errText: 'Невозможно удалить услугу, использующуюся в системе.' });
                    return;
                }

                Service.deleteOne(service, function(err, ok) {
                    if (err) {
                        //TODO что делаем при ошибке?
                        return;
                    }
                    res.send({ ok: 'ok' });
                });
            })
    }
};

function isErrorValidateService(name, type) {
    return name.length == 0 || name.length >= 25 || ['0', '1', '2', '3'].indexOf(type) == -1;
}