'use strict';

const ClientType = require('../models/ClientType'), 
    Render = require('../render'),
    render = Render.render;

module.exports = {
    getAll: function (req, res) {
        ClientType.find({}).then( clientTypes => {
            res.locals.clientTypes = clientTypes;
            render(req, res, {
                viewName: 'handbook',
                options: {
                    title: 'Справочник типов клиентов',
                    handbookType: 'client-types',
                    reqUrl: '/admin/client-types/add'
                }
            });
        });
    },
    getPage: function (req, res) {
        var pagerId = 'client-types',
            pagers = [],
            pageNumber = req.query['pager' + pagerId] || 1,
            perPage = 2; // TODO брать из конфига?

        if (!!(+pageNumber) && (+pageNumber) > 0) {
            pageNumber = +pageNumber;
            pagers[0] = pagerId;
        }
        else
            res.redirect(req.path);

        ClientType.paginate({}, { page: pageNumber, limit: perPage})
            .then((clientTypes) => {
                if (!clientTypes.docs.length)
                {
                    if (pageNumber !== 1) {
                        res.redirect(req.path);
                    } else {
                        render(req, res, {
                            viewName: 'handbook',
                            options: {
                                title: 'Справочник типов клиентов',
                                handbookType: 'client-types',
                                reqUrl: '/admin/client-types/add'
                            }
                        });
                    }
                    return;
                }

                res.locals.clientTypes = clientTypes.docs;
                res.locals.pagers = {};
                res.locals.pagers[pagerId] = {
                    pageNumber: +pageNumber,
                    records: clientTypes.total,
                    perPage: clientTypes.limit
                };
                render(req, res, {
                    viewName: 'handbook',
                    options: {
                        title: 'Справочник типов клиентов',
                        handbookType: 'client-types',
                        pagers: pagers,
                        reqUrl: '/admin/client-types/add'
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

        if (isErrorValidateClientType(obj.name, obj.type)) {
            res.status(400).send({ errText: 'Ошибка валидации' });
            return;
        }

        ClientType.findOne({ name: obj.name, type: obj.type })
            .then(clientType => {
                var newClientType;

                if (clientType != null) {
                    res.status(400).send({ errText: 'Такой тип клиента уже есть в базе.' });
                    return;
                } 

                newClientType = new ClientType({
                    name: obj.name,
                    type: obj.type
                });
                return newClientType.save();
            })
            .then(() => {
                res.send({ created: true});
            });
    },
    edit: function (req, res) {
        var reqData = req.body;

        if (isErrorValidateClientType(reqData.obj.name, reqData.obj.type)) {
            res.status(400).send({ errText: 'Ошибка валидации' });
            return;
        }

        ClientType.findOne({ name: reqData.obj.name, type: reqData.obj.type})
            .then(clientType => {
                if (clientTypes != null) {
                    res.status(400).send({ errText: 'Такой тип клиента уже есть в базе.' });
                    return;
                } 

                ClientType.findByIdAndUpdate(
                    reqData.obj._id,
                    { name: reqData.obj.name, type: reqData.obj.type},
                    function(err, clientType) {
                        if (err) return; //TODO что делаем при ошибке?
                        if (clientType == null) {
                            res.status(400).send({ errText: 'Невозможно изменить несуществующий тип клиента.' });
                        } else {
                            res.send({ ok: 'ok' });
                        }
                    });
            });
    },
    delete: function (req, res) {
        ClientType.findById(req.body.obj._id)
            .then(clientType => {
                if (clientType == null) {
                    res.status(400).send({ errText: 'Невозможно удалить несуществующий тип клиента.' });
                    return;
                }

                if (clientType.isUsed()) {
                    res.status(400).send({ errText: 'Невозможно удалить тип клиента, использующийся в системе.' });
                    return;
                }

                ClientType.deleteOne(clientType, function(err, ok) {
                    if (err) {
                        //TODO что делаем при ошибке?
                        return;
                    }
                    res.send({ ok: 'ok' });
                });
            })
    }
};

function isErrorValidateClientType(name, shortName) {
    return name.length == 0 || name.length >= 25 || shortName.length == 0 || shortName.length >= 25;
}