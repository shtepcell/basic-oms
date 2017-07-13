'use strict';

const City = require('../models/City'), 
    Render = require('../render'),
    render = Render.render;

module.exports = {
    getAll: function (req, res) {
        City.find({}).then( cities => {
            res.locals.cities = cities;
            render(req, res, {
                viewName: 'handbook',
                options: {
                    title: 'Справочник городов',
                    handbookType: 'cities'
                }
            });
        });
    },
    getPage: function (req, res) {
        var pagerId = 'cities',
            pagers = [],
            pageNumber = req.query['pager' + pagerId] || 1,
            perPage = 2; // TODO брать из конфига?

        if (!!(+pageNumber) && (+pageNumber) > 0) {
            pageNumber = +pageNumber;
            pagers[0] = pagerId;
        }
        else
            res.redirect(req.path);

        City.paginate({}, { page: pageNumber, limit: perPage})
            .then((cities) => {
                if (!cities.docs.length)
                {
                    if (pageNumber !== 1) {
                        res.redirect(req.path);
                    } else {
                        render(req, res, {
                            viewName: 'handbook',
                            options: {
                                title: 'Справочник городов',
                                handbookType: 'cities'
                            }
                        });
                    }
                    return;
                }

                res.locals.cities = cities.docs;
                res.locals.pagers = {};
                res.locals.pagers[pagerId] = {
                    pageNumber: +pageNumber,
                    records: cities.total,
                    perPage: cities.limit
                };
                render(req, res, {
                    viewName: 'handbook',
                    options: {
                        title: 'Справочник городов',
                        handbookType: 'cities',
                        pagers: pagers
                    }
                });
            })
            .catch((err) => {
                console.log('errr', err);
                // TODO: что делаем при ошибке?
            });
    },
    getOne: function (req, res) {
        //оно нам надо?
    },
    create: function (req, res) {

    },
    edit: function (req, res) {
        var reqData = req.body,
            hasClone = false;

        if (reqData.obj.name.length == 0 || reqData.obj.name.length >= 25 || ['г.', 'с.', 'пгт.'].indexOf(reqData.obj.type) == -1) {
            res.status(400).send({ errText: 'Ошибка валидации' });
            return;
        }

        City.findOne({ name: reqData.obj.name, type: reqData.obj.type})
            .then(city => {
                if (city != null) {
                    res.status(400).send({ errText: 'Город с таким названием уже есть в базе.' });
                    return;
                } 

                City.findByIdAndUpdate(
                    reqData.obj._id,
                    { name: reqData.obj.name, type: reqData.obj.type},
                    function(err, city) {
                        if (err) return; //TODO что делаем при ошибке?
                        if (city == null) {
                            res.status(400).send({ errText: 'Невозможно изменить несуществующий город.' });
                        } else {
                            res.send({ ok: 'ok' });
                        }
                    });
            });
    },
    delete: function (req, res) {
        City.findById(req.body.obj._id)
            .then(city => {
                if (city == null) {
                    res.status(400).send({ errText: 'Невозможно удалить несуществующий город.' });
                    return;
                }

                if (city.isUsed()) {
                    res.status(400).send({ errText: 'Невозможно удалить город, использующийся в системе.' });
                    return;
                }

                City.deleteOne(city, function(err, ok) {
                    if (err) {
                        //TODO что делаем при ошибке?
                        return;
                    }
                    res.send({ ok: 'ok' });
                });
            })
    }
};
