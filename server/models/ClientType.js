var mongoose = require('../controllers/connect'),
	Schema = mongoose.Schema,
	mongoosePaginate = require('mongoose-paginate');

var Client = require('./Client');

var schema = new Schema( {
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
}, {
    usePushEach: true
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
