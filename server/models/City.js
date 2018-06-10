var mongoose = require('../controllers/connect'),
	Schema = mongoose.Schema,
	mongoosePaginate = require('mongoose-paginate');

var schema = new Schema( {
	name : {
		type : String,
		required : true
	},
	type : {
		type: String,
		enum: ['г.', 'пгт.', 'с.', 'пос.'],
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
        this.usage = false;
        return this.save();
    }
}
var city = mongoose.model('City', schema);
module.exports = city;
