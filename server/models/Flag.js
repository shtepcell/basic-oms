var mongoose = require('../controllers/connect'),
    Schema = mongoose.Schema;

var schema = new Schema( {
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    order: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    }
}, {
    usePushEach: true
});

var flag = mongoose.model('Flag', schema);
module.exports = flag;
