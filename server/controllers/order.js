'use strict';
const Order = require('../models/Order');
const Department = require('../models/Department');
const Account = require('../models/Account');
// const Client = require('../models/Client');
const Provider = require('../models/Provider');
const Service = require('../models/Service');
const City = require('../models/City');
// const Street = require('../models/Street');

const fields = require('./fields');


const Render = require('../render'),
    render = Render.render;

const logger = require('./logger');

module.exports = {

    getPageInit: async (req, res) => {
        res.locals.services = await Service.find();
        res.locals.template = await fields.getInitField();

        render(req, res, {
            viewName: 'orders/init'
        });
    }
};
