var mongoose = require('../controllers/connect'),
	Schema = mongoose.Schema;

var schema = new mongoose.Schema({
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    },
    type: {
        type: String,
        required: true
    },
    text: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    read: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Account'
        }
    ]
});

var notifies = mongoose.model('Notify', schema);
module.exports = notifies;
