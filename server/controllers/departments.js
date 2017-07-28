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
                viewName: 'departments'
            });
        })
    }

};
