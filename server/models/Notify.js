var mongoose = require('../controllers/connect'),
	Schema = mongoose.Schema;

var schema = new Schema({
    order: Number,
	recipients: [String],
    text: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
	initiator: String,
    read: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Account'
        }
    ]
}, {
    usePushEach: true
});

var notifies = mongoose.model('Notify', schema);
module.exports = notifies;
