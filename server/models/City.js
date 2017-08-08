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
        Department.find({cities: this}).then( deps => {
            if(deps.length == 0) {
                this.usage = false;
                return this.save();
            }
        })
    }
}
var city = mongoose.model('City', schema);
module.exports = city;
