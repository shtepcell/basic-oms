'use strict';

const Client = require('../models/Client'),
    ClientType = require('../models/ClientType'),
    Order = require('../models/Order'),
    Render = require('../render'),
    render = Render.render;

const logger = require('./logger');

module.exports = {

    getPage: async (req, res) => {
        var pagerId = 'clients',
            pagers = [],
            pageNumber = req.query['pager' + pagerId] || 1,
            perPage = 30; // TODO брать из конфига?

        if (!!(+pageNumber) && (+pageNumber) > 0) {
            pageNumber = +pageNumber;
            pagers[0] = pagerId;
        }
        else {
            res.redirect(req.path);
            return;
        }

        var isInit = res.locals.__user.department.type == 'b2b' || res.locals.__user.department.type == 'b2o',
            isAdmin = res.locals.__user.department.type == 'admin'

        if(!isInit && !isAdmin) {
          render(req, res, { view: '404' });
          return;
        }
        res.locals.clientTypeArr = await ClientType.find({}).select({ shortName: 1, _id: 1 })

        var clients = await Client.paginate({}, { page: pageNumber, limit: perPage, populate: 'type'});

        if(req.query.name) {
            var val = req.query.name;
            val = val.replace(/\[/g, '');
            val = val.replace(/\]/g, '');
            val = val.replace(/\\/g, '');
            val = val.replace(/\(/g, '');
            val = val.replace(/\)/g, '');
            var rgx =  new RegExp('' + val + '', 'i');
            clients = await Client.paginate({name: {$regex: rgx}}, { page: pageNumber, limit: perPage, populate: 'type'});
        }

        if(clients.total == 0) clients.total = 1;
        res.locals.query = req.query;
        res.locals.clients = clients.docs;
        res.locals.pagers = {};
        res.locals.pagers[pagerId] = {
            pageNumber: +pageNumber,
            records: clients.total,
            perPage: clients.limit
        };
        render(req, res, {
            viewName: 'handbook',
            options: {
                title: 'Справочник клиентов',
                handbookType: 'clients',
                pagers: pagers,
                reqUrl: '/admin/clients/add'
            }
        });
    },

    create: async (req, res) => {
        var obj = {
            name: req.body.name.trim(),
            typeId: req.body.typeId
        };

        var errors = [];

        var client = await Client.findOne({ name: obj.name, type: obj.typeId })

        if (client != null) {
            res.status(400).send({ errText: 'Такой клиент уже существует в системе' });
            return;
        }

        var cT = await ClientType.findOne({ _id: obj.typeId });
        cT.using(true);

        if (!cT) {
            res.status(400).send({ errText: 'Не существует такого типа клиента в системе' });;
            return;
        }

        var newClient = new Client({
            name: obj.name,
            type: obj.typeId
        });

        var done = await saver(newClient);

        if(!!done) {
            logger.info(`Created Client [${ done.type }] ${ done.name } `, res.locals.__user);
            res.send({ created: true});
        } else res.status(400).send({ errText: `Произошла ошибка при сохранении.
            Попробуйте еще раз. При повторении этой ошибки - сообщите разработчику.`});

    },

    edit: async (req, res) => {
        var reqData = req.body,
            clientType = reqData.obj.type,
            prevClientType;


        var client = await Client.findOne({ name: reqData.obj.name.trim(), type: clientType});

        if (client != null && client._id != reqData.obj._id) {
            res.status(400).send({ errText: 'Такой клиент уже существует в системе' });
            return;
        }

        var cT = await ClientType.findOne({ _id: clientType });

        if (!cT) {
            res.status(400).send({ errText: 'Такой тип клиента не существует' });
            return;
        }

        client = await Client.findOne({ _id: reqData.obj._id }).populate('type');

        if(client == null) {
            res.status(400).send({ errText: 'Попытка редактирования несуществующего клиента' });
            return;
        }

        var oldClient = {
            name: client.name,
            type: client.type
        };
        var oldCT = client.type;

        client.name = reqData.obj.name.trim();
        client.type = clientType;

        var done = await saver(client);

        if (!!done) {
            cT.using(true);
            oldCT.using(false);
            logger.info(`Edit Client [${ oldClient.type.shortName }] ${ oldClient.name } --> [${ done.type.shortName }] ${ done.name } `, res.locals.__user);
            res.send({ ok: 'ok' });
        } else {
            res.status(400).send({ errText: `Произошла ошибка при сохранении.
                Попробуйте еще раз. При повторении этой ошибки - сообщите разработчику.`});
        }

    },

    delete: async (req, res) => {

        var client = await Client.findById(req.body.obj._id).populate('type'),
            _client = {
                name: client.name,
                type: client.type
            };

        if (client == null) {
            res.status(400).send({ errText: 'Попытка удаления несуществующего клиента' });
            return;
        }

        var orders = await Order.find({'info.client': client}).lean(),
            used = (orders.length > 0);

        var clientType = client.type;

        if (used) {
            res.status(400).send({ errText: 'Невозможно удалить клиента, использующегося в системе.' });
            return;
        }

        var done;

        try {
            done = await client.remove();
        } catch (err) {
            done = false;
            logger.error(err.message);
        }

        if (!!done) {
            clientType.using(false);
            logger.info(`Delete Client [${ done.type.shortName }] ${ done.name } `, res.locals.__user);
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
