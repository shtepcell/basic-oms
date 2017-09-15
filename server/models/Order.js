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
    pause: {
        status: Boolean,
        data: Date
    },
    info: {
        relation: String,
        cms: String,
        'date-request': Date,
        'cost-once': String,
        'cost-monthly': String,
        add_info: String,
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
            required : true
        },
        contact: String,
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required : true
        },
        options: String,
        city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'City',
            required : true
        },
        street: String,
        adds: String,
        ip: Boolean,
        pool: String
    },
    gzp: {
        need: Boolean,
        capability: Boolean,
        time: Number,
        'cost-once': String,
        'cost-monthly': String
    },
    // stop: {
    //     capability: Boolean,
    //     provider: {
    //         type: String
    //     },
    //     contact: String,
    //     devices: String,
    //     add_devices: String,
    //     interfaces: String,
    //     time: Number,
    //     add_info: String,
    //     organization_info: String,
    //     cost: {
    //         once: Number,
    //         monthly: Number
    //     }
    // },
    // address: {
    //     city: String, //TODO: привязка к городу
    //     street: String, //TODO: привязка к удице
    //     adds: String
    // },
    // close: {
    //     file: String,
    //     date: Date
    // },
    // history: []
});

var deepPopulate = require('mongoose-deep-populate')(mongoose);
schema.plugin(deepPopulate);

var order;

schema.statics.getNextId = async () => {
    var ret = await order.find().sort('id');

    if(ret.length == 0) {
        return 1;
    }
    return ret[ret.length - 1].id + 1;

};

schema.statics.create = async(ordr) => {
    var id = await order.getNextId();
    ordr.id = id;
    return ordr.save();
}

schema.plugin(mongoosePaginate);
order = mongoose.model('Order', schema);

module.exports = order;
