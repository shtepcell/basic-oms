const mongoose = require('../controllers/connect');
const Schema = mongoose.Schema;

var schema = new Schema({
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
    priorityCapacity: Number,
    cities: [
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
