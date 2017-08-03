'use strict';

const Department = require('../models/Department');

const Render = require('../render'),
    render = Render.render;

const logger = require('./logger');

module.exports = {

    getAll: function (req, res) {
        Department.find().then( deps => {
            res.locals.departments = deps;
            render(req, res, {
                viewName: 'departments/list'
            });
        })
    },

    getOne: function (req, res) {
        Department.findOne({ _id: req.params.id}).then( dep => {
            res.locals.department = dep;
            render(req, res, {
                viewName: 'departments/item'
            });
        })
    },

    getPageCreate: function (req, res) {
        render(req, res, {
            viewName: 'departments/create'
        });
    },

    create: function (req, res) {
        var reqData = req.body,
            errors = [];

        Department.findOne({name: reqData.name})
            .then( dep => {

                if( dep ) errors.push({errText: 'Отдел с таким названием уже существует!'})

                if(errors.length === 0) {
                    var department = new Department({
                        name: reqData.name,
                        type: reqData.type
                    });

                    logger.info(`Created department ${ department.name }`, res.locals.__user);
                    return department.save();
                } else res.status(400).send(errors);

            })
            .then( dep => {
                if(dep) res.send({ok: 'ok'});
            })
            .catch( err => logger.error(err))
    },

    edit: function (req, res) {
        var reqData = req.body,
            errors = [];

        Department.findOne({name: reqData.name})
            .then( dep => {

                if( dep && req.params.id != dep._id) errors.push({errText: 'Отдел с таким названием уже существует!'})

                if(errors.length === 0) {

                    return Department.findOne({_id: req.params.id}).then( department => {
                        department.name = reqData.name || department.name;
                        department.type = reqData.type || department.type;
                        logger.info(`Edit department ${ department.name }`, res.locals.__user);
                        return department.save();
                    })

                } else res.status(400).send(errors);

            })
            .then( dep => {
                if(dep) res.send({ok: 'ok'});
            })
            .catch( err => logger.error(err))
    }

};
