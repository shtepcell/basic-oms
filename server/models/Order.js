var mongoose = require('../controllers/connect'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate');

var schema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    isOld: Boolean,
    special: {
        type: Schema.Types.ObjectId,
        ref: 'Department'
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
        date: Date
    },
    requestPause: {
        status: Boolean,
        date: Date,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'Account'
        }
    },
    preVolume: String,
    info: {
        initiator: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
            required: true
        },
        department: {
            type: Schema.Types.ObjectId,
            ref: 'Department',
            required: true
        },
        relation: String,
        cms: String,
        idoss: String,
        'income-once': String,
        'income-monthly': String,
        add_info: String,
        client: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
            required: true
        },
        contact: String,
        service: {
            type: String,
            required: true
        },
        options: String,
        city: {
            type: Schema.Types.ObjectId,
            ref: 'City',
            required: true
        },
        coordinate: String,
        street: {
            type: Schema.Types.ObjectId,
            ref: 'Street'
        },
        adds: String,
        ip: String,
        volume: String,
        pool: String,
        order: String,
        'date-sign': Date,
        'date-request': Date,
        'file-init': String,

        g70x: String,

        e1Stream: String,
        alertType: String,
        countOfConnectionLine: String,
        crc4Support: String,
        networkPart: String,

        presentationMethod: String,

        countOfLines: String,
        countOfNumbers: String,
        countOfOutNumbers: String,

        typeOfClient: String,

        mikrotik: String,
        internet: String,
        needAgree: String,

        schema: String, // File
        pm: String,

        pref: String,
        
        useDefaultBlackList: String,
        blackListFile: String, // File

        layingMethod: String,
        countOfPorts: String,
        objectPhoto: String, // File

        countOfUtits: String,
        rack: String,
        powerConsumption: String,
        montageNeed: String,
        connetionNeed: String,
        confirmDocument: String // File
    },
    sks: {
        time: Number,
        'cost-once': String,
        'cost-monthly': String,
        add_info: String
    },
    gzp: {
        complete: Boolean,
        need: Boolean,
        capability: Boolean,
        time: Number,
        'cost-once': String,
        'cost-monthly': String,
        reason: String,
        add_info: String,
        odf: String,
        node: String
    },
    stop: {
        complete: Boolean,
        capability: Boolean,
        provider: {
            type: Schema.Types.ObjectId,
            ref: 'Provider'
        },
        reason: String,
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
        pause: Date,
        'cs-gzp-pre': Date,
        'cs-stop-pre': Date,
        'cs-gzp-organization': Date,
        'cs-stop-organization': Date,
        'cs-sks-pre': Date,
        'cs-sks-organization': Date,
        'cs-client-match': Date,
        'cs-client-notify': Date,
        'client-match': Date,
        'client-notify': Date,
        'gzp-pre': Date,
        'gzp-build': Date,
        'install-devices': Date,
        'stop-pre': Date,
        'stop-build': Date,
        'sks-pre': Date,
        'sks-build': Date,
        'network': Date,
        'succes': Date,
        'reject': Date
    },
    history: [{
        name: String,
        date: Date,
        author: String
    }]
});

var deepPopulate = require('mongoose-deep-populate')(mongoose);
schema.plugin(deepPopulate);

var order;

schema.statics.getNextId = async () => { //TODO: Сделать counter
    var ret = await order.find().sort('id').lean();

    if (ret.length == 0)
        return 1;

    return ret[ret.length - 1].id + 1;
};

schema.statics.create = async (ordr) => {
    var id = await order.getNextId();
    ordr.id = id;
    return ordr.save();
}

schema.plugin(mongoosePaginate);
order = mongoose.model('Order', schema);

module.exports = order;
