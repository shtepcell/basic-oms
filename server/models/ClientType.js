'use strict';

var mongoose = require('../controllers/connect');
var mongoosePaginate = require('mongoose-paginate');

var schema = mongoose.Schema( {
    name : {
        type : String,
        required : true
    },
    shortName : {
        type: String,
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

var clientType = mongoose.model('ClientType', schema);
module.exports = clientType;
