var mongoose = require('../controllers/connect'),
	Schema = mongoose.Schema,
	mongoosePaginate = require('mongoose-paginate');

var schema = new Schema( {
    name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    type: {
        type: String,
        required: true
    },
    cities : [
        {
            type: Schema.Types.ObjectId,
            ref: 'City'
        }
    ]
}, {
    usePushEach: true
});

var department = mongoose.model('Department', schema);
module.exports = department;
