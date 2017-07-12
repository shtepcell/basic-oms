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
                    res.redirect(req.path);
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

    },
    delete: function (req, res) {
        res.status(404).send({ err: 'errorText'});
    }
};
