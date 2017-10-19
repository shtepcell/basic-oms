'use strict';

var mongoose = require('../controllers/connect');
var mongoosePaginate = require('mongoose-paginate');

var schema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    deadline: {
        type: Date
    },
    cs: {
        type: Number
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
        initiator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',
            required : true
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department',
            required : true
        },
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
        pool: String,
        order: String,
        'date-sign': Date
    },
    gzp: {
        complete: Boolean,
        need: Boolean,
        capability: Boolean,
        time: Number,
        'cost-once': String,
        'cost-monthly': String,
        add_info: String
    },
    stop: {
        complete: Boolean,
        capability: Boolean,
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Provider'
        },
        contact: String,
        devices: String,
        add_devices: String,
        interfaces: String,
        time: Number,
        add_info: String,
        organization_info: String,
        'cost-once': String,
        'cost-monthly': String
    },
    date: {
        init: Date,
        'cs-gzp-pre': Date,
        'cs-stop-pre': Date,
        'cs-gzp-organization': Date,
        'cs-stop-organization': Date,
        'cs-client-match': Date,
        'cs-client-notify': Date,
        'client-match': Date,
        'client-notify': Date,
        'gzp-pre': Date,
        'gzp-build': Date,
        'install-devices': Date,
        'stop-pre': Date,
        'stop-build': Date,
        'network': Date,
        'succes': Date,
        'reject': Date
    },
    history: [{
        name: String,
        date: Date,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',
            required : true
        }
    }]
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
