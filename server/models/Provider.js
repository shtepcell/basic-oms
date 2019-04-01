var mongoose = require('../controllers/connect');
var mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema( {
	name : {
		type : String,
		required : true
	},
	type : {
		type: String,
		enum: ['СТОП', 'VSAT'],
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

var provider = mongoose.model('Provider', schema);
module.exports = provider;
