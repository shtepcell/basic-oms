const mongoose = require('../controllers/connect');
const Schema = mongoose.Schema;

const { ObjectId } = Schema.Types;

const schema = new Schema({
	login: {
		type: String,
		required: true,
		unique: true,
		lowercase: true
	},
	password: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	email: String,
	phone: String,
	department: {
		type: ObjectId,
		ref: 'Department',
		required: true
	},
	status: {
		type: Boolean,
		required: true
	},
	notifies: [{
		type: ObjectId,
		ref: 'Notify'
	}],
	flags: [{
		order: Number,
		state: Number
	}],
	last: String,
	settings: {
		table: {
			perPage: Number
		},
		sendEmail: {
			type: Boolean,
			default: true
		},
		main: {
			initiators: [
				{
					type: Schema.Types.ObjectId,
					ref: 'Department'
				}
			],
			zone: [String],
			stage: [String]
		},
		search: {
			query: String
		}
	},
	created: Date,
	firstVisit: Date,
	lastVisit: Date,
}, {
	usePushEach: true
});

var deepPopulate = require('mongoose-deep-populate')(mongoose);

schema.plugin(deepPopulate);

schema.methods.remove = function () {
	if (this.status) {
		this.login = Date.now() + this.login;
		this.status = false;
		return this.save();
	} else {
		throw `Account ${this.login} cant be deleted!`
	}
}

var account = mongoose.model('Account', schema);
module.exports = account;
