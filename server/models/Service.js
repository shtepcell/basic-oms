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
		enum: ['0', '1', '2', '3'],
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

var service = mongoose.model('Service', schema);
module.exports = service;
