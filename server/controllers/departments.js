'use strict';

const Department = require('../models/Department');
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
        res.locals.department = await Department.findOne({ _id: req.params.id});
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
        var reqData = req.body,
            errors = [];

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
