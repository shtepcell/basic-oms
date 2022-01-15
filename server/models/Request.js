var mongoose = require('../controllers/connect'),
    Schema = mongoose.Schema;

var schema = new Schema( {
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    orders: [{
        type: Schema.Types.String,
        required: true
    }],
    action: {
        type: Schema.Types.String,
        required: true,
    },
    status: {
        type: Schema.Types.String,
        required: true,
    },
    created: {
        type: Schema.Types.Date,
        required: true,
    }
}, {
    usePushEach: true
});

var request = mongoose.model('Request', schema);
module.exports = request;
