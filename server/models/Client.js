'use strict';

var mongoose = require('../controllers/connect'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate');

var schema = Schema( {
    name : {
        type : String,
        required : true
    },
    type : {
        type: Schema.Types.ObjectId,
        ref: 'ClientType',
        required : true
    },
    usage : {
        type: Boolean
    }
});

schema.plugin(mongoosePaginate);

schema.methods.isUsed = function() {
    return !!this.usage;
}

var client = mongoose.model('Client', schema);
module.exports = client;
