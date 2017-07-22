'use strict';

const Provider = require('../models/Provider'), 
    Render = require('../render'),
    render = Render.render;

module.exports = {
    getAll: function (req, res) {
        Provider.find({}).then( prvdrs => {
            res.locals.prvdrs = prvdrs;
            render(req, res, {
                viewName: 'handbook',
                options: {
                    title: 'Справочник провайдеров',
                    handbookType: 'providers',
                    reqUrl: '/admin/providers/add'
                }
            });
        });
    },
    getPage: function (req, res) {
        var pagerId = 'providers',
            pagers = [],
            pageNumber = req.query['pager' + pagerId] || 1,
            perPage = 2; // TODO брать из конфига?

        if (!!(+pageNumber) && (+pageNumber) > 0) {
            pageNumber = +pageNumber;
            pagers[0] = pagerId;
        }
        else
            res.redirect(req.path);

        Provider.paginate({}, { page: pageNumber, limit: perPage})
            .then((prvdrs) => {
                if (!prvdrs.docs.length)
                {
                    if (pageNumber !== 1) {
                        res.redirect(req.path);
                    } else {
                        render(req, res, {
                            viewName: 'handbook',
                            options: {
                                title: 'Справочник провайдеров',
                                handbookType: 'providers',
                                reqUrl: '/admin/providers/add'
                            }
                        });
                    }
                    return;
                }

                res.locals.prvdrs = prvdrs.docs;
                res.locals.pagers = {};
                res.locals.pagers[pagerId] = {
                    pageNumber: +pageNumber,
                    records: prvdrs.total,
                    perPage: prvdrs.limit
                };
                render(req, res, {
                    viewName: 'handbook',
                    options: {
                        title: 'Справочник городов',
                        handbookType: 'providers',
                        pagers: pagers,
                        reqUrl: '/admin/providers/add'
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

        if (isErrorValidateProvider(obj.name, obj.type)) {
            res.status(400).send({ errText: 'Ошибка валидации' });
            return;
        }

        Provider.findOne({ name: obj.name, type: obj.type })
            .then(prvdr => {
                var newPrvdr;

                if (prvdr != null) {
                    res.status(400).send({ errText: 'Провайдер с таким названием уже есть в базе.' });
                    return;
                } 

                newPrvdr = new Provider({
                    name: obj.name,
                    type: obj.type
                });
                return newPrvdr.save();
            })
            .then(() => {
                res.send({ created: true});
            });
    },
    edit: function (req, res) {
        var reqData = req.body,
            hasClone = false;

        if (isErrorValidateProvider(reqData.obj.name, reqData.obj.type)) {
            res.status(400).send({ errText: 'Ошибка валидации' });
            return;
        }

        Provider.findOne({ name: reqData.obj.name, type: reqData.obj.type})
            .then(prvdr => {
                if (prvdr != null) {
                    res.status(400).send({ errText: 'Провайдер с таким названием уже есть в базе.' });
                    return;
                } 

                Provider.findByIdAndUpdate(
                    reqData.obj._id,
                    { name: reqData.obj.name, type: reqData.obj.type},
                    function(err, prvdr) {
                        if (err) return; //TODO что делаем при ошибке?
                        if (prvdr == null) {
                            res.status(400).send({ errText: 'Невозможно изменить несуществующего провайдера.' });
                        } else {
                            res.send({ ok: 'ok' });
                        }
                    });
            });
    },
    delete: function (req, res) {
        Provider.findById(req.body.obj._id)
            .then(prvdr => {
                if (prvdr == null) {
                    res.status(400).send({ errText: 'Невозможно удалить несуществующего провйдера.' });
                    return;
                }

                if (prvdr.isUsed()) {
                    res.status(400).send({ errText: 'Невозможно удалить провайдера, использующегося в системе.' });
                    return;
                }

                Provider.deleteOne(prvdr, function(err, ok) {
                    if (err) {
                        //TODO что делаем при ошибке?
                        return;
                    }
                    res.send({ ok: 'ok' });
                });
            })
    }
};

function isErrorValidateProvider(name, type) {
    // TODO: consts.js
    return name.length == 0 || name.length >= 25 || ['STOP', 'WSAT'].indexOf(type) == -1;
}