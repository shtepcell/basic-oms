'use strict';

var mongoose = require('../controllers/connect');

var schema = mongoose.Schema( {
	login : {
		type : String,
		required : true,
		unique : true,
		lowercase : true
	},
	password : {
		type : String,
		required : true
	},
	name : {
		type : String,
		required : true
	},
	email : String,
	phone : String,
	role : {
		type : Number,
		required : true
	},
	status : {
		type : Boolean,
		required : true
	}
});

schema.methods.remove = function () {
	if(this.status) {
		this.login = Date.now() + this.login;
		this.status = false;
		return this.save();
	} else throw `Account ${this.login} cant be deleted!`
}

var account = mongoose.model('Account', schema);
module.exports = account;
