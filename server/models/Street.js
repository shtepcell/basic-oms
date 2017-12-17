'use strict';

var mongoose = require('../controllers/connect');
var mongoosePaginate = require('mongoose-paginate');

var schema = mongoose.Schema( {
	name : {
		type : String,
		required : true
	},
	type : {
		type: String,
		required : true
	},
	usage : {
		type: Boolean,
        default: false
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
        this.usage = false;
        return this.save();
    }
}

var street = mongoose.model('Street', schema);
module.exports = street;
