'use strict';

const Department = require('../models/Department');
const City = require('../models/City');
const Render = require('../render'),
    render = Render.render;

const logger = require('./logger');

module.exports = {

    getAll: async (req, res) => {
        res.locals.departments = await Department.find();
        render(req, res, {
            viewName: 'departments/list'
        });
    },

    getOne: async (req, res) => {
        res.locals.department = await Department.findOne({ _id: req.params.id}).populate('cities');
        res.locals.cities = await City.find();

        render(req, res, {
            viewName: 'departments/item'
        });
    },

    getPageCreate: function (req, res) {
        render(req, res, {
            viewName: 'departments/create'
        });
    },

    create: async (req, res) => {
        var reqData = req.body;
        var dep = await Department.findOne({name: reqData.name});

        if(dep != null) {
            res.status(400).send({errText: 'Отдел с таким названием уже существует!'})
            return;
        }

        dep = new Department({
            name: reqData.name,
            type: reqData.type
        });
        var done = await saver(dep);
        if(!!done) {
            logger.info(`Created Department [${ done.type }] ${ done.name }`, res.locals.__user);
            res.send({ created: true });
        } else res.status(400).send({ errText: `Произошла ошибка при сохранении.
            Попробуйте еще раз. При повторении этой ошибки - сообщите разработчику.`});
    },

    edit: async (req, res) => {
        var reqData = req.body;

        var dep = await Department.findOne({name: reqData.name});

        if( dep && req.params.id != dep._id) {
            res.status(400).send({errText: 'Отдел с таким названием уже существует!'})
            return;
        }

        dep = await Department.findOne({_id: req.params.id});
        var oldDep = {
            name: dep.name,
            type: dep.type
        };

        dep.name = reqData.name || dep.name;
        dep.type = reqData.type || dep.type;

        var done = await saver(dep);
        if(!!done) {
            logger.info(`Edit Department [${ oldDep.type }] ${ oldDep.name } --> [${ done.type }] ${ done.name }`, res.locals.__user);
            res.send({ created: true });
        } else res.status(400).send({ errText: `Произошла ошибка при сохранении.
            Попробуйте еще раз. При повторении этой ошибки - сообщите разработчику.`});

    },

    addCity: async (req, res) => {
        var reqData = req.body;

        var dep = await Department.findOne({_id: req.params.id});
        var qr = parserCity(reqData.city);
        var city = await City.find(qr);

        if(!dep) {
            res.status(400).send({errText: 'Такого отдела не существует.'})
            return;
        }

        if(city.length == 0) {
            res.status(400).send({errText: 'Такого города не существует.'})
            return;
        }

        if(city.length > 1) {
            res.status(400).send({errText: 'Найденно несколько городов с похожим названием. Уточните название'})
            return;
        }

        if(dep.cities.indexOf(city[0]._id) != -1) {
            res.status(400).send({errText: 'Этот город уже привязан к этому отделу.'})
            return;
        }

        if(dep.cities) {
            dep.cities.push(city[0]);
        } else {
            dep.cities = [city[0]];
        }

        var done = await saver(dep);
        if(!!done) {
            city[0].using(true);
            logger.info(`Add City ${city[0].name} to Department ${ done.name }`, res.locals.__user);
            res.send({ created: true });
        } else res.status(400).send({ errText: `Произошла ошибка при сохранении.
            Попробуйте еще раз. При повторении этой ошибки - сообщите разработчику.`});
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

function parserCity(str) {
    var res = { type: '', name: ''};
    for (var i = 0; i < str.length; i++) {
        if(str[i] === '.') {
            res.type += '.';
            res.name = str.slice(i+2, str.length);
            return res;
        } else res.type += ''+str[i];
    }
}
