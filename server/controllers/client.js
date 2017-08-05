'use strict';

const Client = require('../models/Client'), 
    ClientType = require('../models/ClientType'),
    Render = require('../render'),
    render = Render.render;

module.exports = {
    getAll: function (req, res) {
        Client.find({}).populate('type')
            .then( clients => {
                res.locals.clients = clients;

                return ClientType.find({}).select({ shortName: 1, _id: 1 });
            })
            .then( types => {
                res.locals.clientTypeArr = types;

                render(req, res, {
                    viewName: 'handbook',
                    options: {
                        title: 'Справочник клиентов',
                        handbookType: 'clients',
                        reqUrl: '/admin/clients/add'
                    }
                });
            })
            .catch( err => {
                res.send(500);
            });
    },
    getPage: function (req, res) {
        var pagerId = 'clients',
            pagers = [],
            pageNumber = req.query['pager' + pagerId] || 1,
            perPage = 2; // TODO брать из конфига?

        if (!!(+pageNumber) && (+pageNumber) > 0) {
            pageNumber = +pageNumber;
            pagers[0] = pagerId;
        }
        else
            res.redirect(req.path);

        ClientType.find({}).select({ shortName: 1, _id: 1 })
            .then( types => {
                res.locals.clientTypeArr = types;
                return Client.paginate({}, { page: pageNumber, limit: perPage, populate: 'type'});
            })
            .then((clients) => {
                if (!clients.docs.length)
                {
                    if (pageNumber !== 1) {
                        res.redirect(req.path);
                    } else {
                        render(req, res, {
                            viewName: 'handbook',
                            options: {
                                title: 'Справочник клиентов',
                                handbookType: 'clients',
                                reqUrl: '/admin/clients/add'
                            }
                        });
                    }
                    return;
                }

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
            })
            .catch((err) => {
                console.log('errr', err);
                // TODO: что делаем при ошибке?
                res.send(500);
            });
    },
    create: function (req, res) {
        var obj = {
                name: req.body.name,
                typeId: req.body.typeId
            };

        if (isErrorValidateClient(obj.name)) {
            res.status(400).send({ errText: 'Ошибка валидации' });
            return;
        }

        Client.findOne({ name: obj.name, type: obj.typeId })
            .then( client => {
                if (client != null) {
                    throw new Error('Такой клиент уже есть в базе.');
                    return;
                } 

                return ClientType.findByIdAndUpdate(
                    obj.typeId,
                    { usage: true }
                );
            })
            .then((cT, err) => {
                if (err) {
                    throw new Error('Невозможно обновить тип клиента');
                    return; 
                }
                
                if (!cT) {
                    throw new Error('Такой тип клиента не существует');
                    return;
                }

                var newClient = new Client({
                    name: obj.name,
                    type: obj.typeId
                });;

                return newClient.save();
            })
            .then(() => {
                res.send({ created: true});
            })
            .catch( err => {
                console.log('errr', err);
                var errMessage = err.message ? err.message : 'Не удается сохранить';
                res.status(400).send({ errText: errMessage });
            });
    },
    edit: function (req, res) {
        var reqData = { obj: {name: 'NEST2', typeId: '5973e2c2b82e324bbcf24fd8', _id: '597a79e150e9cf826f5dc5cc'}},// req.body,
            clientType = reqData.obj.typeId,
            prevClientType;

        if (isErrorValidateClient(reqData.obj.name)) {
            res.status(400).send({ errText: 'Ошибка валидации' });
            return;
        }

        Client.findOne({ name: reqData.obj.name, type: clientType})
            .then( client => {
                if (client != null) {
                    throw new Error('Такой клиент уже есть в базе.');
                    return;
                } 

                return ClientType.findByIdAndUpdate(
                    clientType,
                    { usage: true }
                );
            })
            .then( (cT, err) => {
                if (!cT) {
                    throw new Error('Такой тип клиента не существует');
                    return;
                }

                return Client.findByIdAndUpdate(
                    reqData.obj._id,
                    { name: reqData.obj.name, type: clientType}
                );
            })
            .then( client => {
                if (client == null) {
                    throw new Error('Невозможно изменить несуществующего клиента.');
                    return;
                }

                prevClientType = client.type;

                return Client.find({ type: prevClientType })
                    .count();
            })
            .then( count => {
                if (count === 0) {
                    return ClientType.findByIdAndUpdate(prevClientType, { usage: false });
                } else {
                    return new Promise((resolve, reject) => {
                        resolve({ edit: true});
                    });
                }
            })
            .then( data => {
                if (!data) {
                    throw new Error('Запись успешно изменена, однако в системе случилась непредвиденная ошибка!');
                    return;
                }

                var resData = data.edit ? { ok: true} : { ok: true, editedUsage: true };
                res.send(resData);
            })
            .catch( err => {
                console.log('errr', err);
                var errMessage = err.message ? err.message : 'Не удается изменить клиента';
                res.status(400).send({ errText: errMessage });
            });
    },
    delete: function (req, res) {
        var clientType;

        Client.findById(req.body.obj._id)
            .then(client => {
                if (client == null) {
                    throw new Error('Невозможно удалить несуществующего клиента.');
                    return;
                }

                clientType = client.type;

                if (client.isUsed()) {
                    throw new Error('Невозможно удалить клиента, использующегося в системе.');
                    return;
                }

                return Client.deleteOne(client);
            })
            .then( ok => {
                return Client.find({ type: clientType })
                        .count();
            })
            .then( count => {
                if (count === 0) {
                    return ClientType.findByIdAndUpdate(clientType, { usage: false });
                } else {
                    return new Promise((resolve, reject) => {
                        resolve({ delete: true});
                    });
                }
            })
            .then( data => {
                if (!data) {
                    throw new Error('Запись успешно удалена, однако в системе случилась непредвиденная ошибка!');
                    return;
                }

                var resData = data.delete ? { ok: true} : { ok: true, editedUsage: true };
                res.send(resData);
            })
            .catch( err => {
                console.log('errr', err);
                var errMessage = err.message ? err.message : 'Не удается удалить';
                res.status(400).send({ errText: errMessage });
            });
    }
};

function isErrorValidateClient(name, typeId) {
    return name.length == 0 || name.length >= 25;
}