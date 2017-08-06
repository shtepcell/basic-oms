'use strict';

var mongoose = require('../controllers/connect');
var mongoosePaginate = require('mongoose-paginate');
var Client = require('./Client');

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

schema.methods.using = function (flag) {
    if (flag) {
        this.usage = true;
        this.save();
    } else {
        Client.find({type: this}).then( clients => {
            if(clients.length == 0) {
                this.usage = false;
                return this.save();
            }
        })

    }
}

var clientType = mongoose.model('ClientType', schema);
module.exports = clientType;
