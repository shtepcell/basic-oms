'use strict';

var mongoose = require('../controllers/connect');
var mongoosePaginate = require('mongoose-paginate');

var schema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true
    },
    service: {
        name: String,
        options: String //TODO: Сервис привязка
    },
    pause: {
        status: Boolean,
        data: Date
    },
    client: {
        type: String,
        required: true // TODO: Клиент привязка
    },
    init: {
        contract: String,
        reqData: Date
    },
    gzp: {
        need: Boolean,
        capability: Boolean,
        time: Number,
        cost: {
            once: Number,
            monthly: Number
        }
    },
    stop: {
        capability: Boolean,
        provider: {
            type: String
        },
        contact: String,
        devices: String,
        add_devices: String,
        interfaces: String,
        time: Number,
        add_info: String,
        organization_info: String,
        cost: {
            once: Number,
            monthly: Number
        }
    },
    address: {
        city: String, //TODO: привязка к городу
        street: String, //TODO: привязка к удице
        adds: String
    },
    close: {
        file: String,
        date: Date
    },
    history: []
});

schema.plugin(mongoosePaginate);

var order = mongoose.model('Order', schema);
module.exports = order;
