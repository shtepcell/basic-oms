'use strict';

// TODO: TRIM NAME

const ClientType = require('../models/ClientType'),
    Render = require('../render'),
    render = Render.render;

const logger = require('./logger');

module.exports = {

    getPage: async (req, res) => {
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

        var clientTypes = await ClientType.paginate({}, { page: pageNumber, limit: perPage})

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

    },

    create: async (req, res) => {

        var obj = {
            name: req.body.name,
            shortName: req.body.shortName
        };

        var clientType = await ClientType.findOne(obj);

        var newClientType;

        if (clientType != null) {
            res.status(400).send({ errText: 'Такой тип клиента уже есть в базе.' });
            return;
        }

        newClientType = new ClientType(obj);

        var done;

        try {
            done = await newClientType.save();
        } catch (err) {
            done = false;
            logger.error(err.message);
        }

        if(!!done) {
            logger.info(`Created Client Type [${ done.shortName }] ${ done.name } `, res.locals.__user);
            res.send({ created: true});
        } else res.status(400).send({ errText: `Произошла ошибка при сохранении.
            Попробуйте еще раз. При повторении этой ошибки - сообщите разработчику.`});

    },

    edit: async (req, res) => {
        var reqData = req.body;

        var clientType = await ClientType.findOne({ name: reqData.obj.name, shortName: reqData.obj.shortName})

        if (clientType != null) {
            res.status(400).send({ errText: 'Такой тип клиента уже есть в базе.' });
            return;
        }

        clientType = await ClientType.findOne({_id: reqData.obj._id});

        if(clientType == null) {
            res.status(400).send({ errText: `Попытка редактирования несуществующего объекта`});
            return;
        }

        var oldClientType = {
            name: clientType.name,
            shortName: clientType.shortName
        };

        clientType.name = reqData.obj.name;
        clientType.shortName = reqData.obj.shortName;

        var done;

        try {
            done = await clientType.save();
        } catch (err) {
            done = false;
            logger.error(err.message);
        }

        if (!!done) {
            logger.info(`Edit Client Type [${ oldClientType.shortName }] ${ oldClientType.name } --> [${ done.shortName }] ${ done.name } `, res.locals.__user);
            res.send({ ok: 'ok' });
        } else {
            res.status(400).send({ errText: `Произошла ошибка при сохранении.
                Попробуйте еще раз. При повторении этой ошибки - сообщите разработчику.`});
        }

    },

    delete: async (req, res) => {
        var clientType = await ClientType.findById(req.body.obj._id);

        if (clientType.isUsed()) {
            res.status(400).send({ errText: 'Невозможно удалить тип клиента, использующийся в системе.' });
            return;
        } else {
            ClientType.deleteOne(clientType, function(err, ok) {
                if (err) {
                    logger.error(err.message);
                    res.status(400).send({ errText: `Произошла ошибка при сохранении.
                        Попробуйте еще раз. При повторении этой ошибки - сообщите разработчику.`});
                    return;
                }
                if(ok) {
                    logger.info(`Delete Client Type  [${ clientType.shortName }] ${ clientType.name }`, res.locals.__user);
                    res.send({ ok: 'ok' });
                }
            });
        }

    }
};
