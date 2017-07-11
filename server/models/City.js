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
		enum: ['г.', 'пгт.', 'с.'],
		required : true
	}
});

schema.plugin(mongoosePaginate);

var city = mongoose.model('City', schema);
module.exports = city;
