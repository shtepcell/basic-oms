'use strict';

const Render = require('../render'),
    render = Render.render;

module.exports = {
    getAll: function (req, res) {
        render(req, res, {
            viewName: 'handbook',
            options: {
                title: 'Справочник городов',
                handbookType: 'cities'
            }
        });
    },
    getPage: function (req, res) {
        
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
