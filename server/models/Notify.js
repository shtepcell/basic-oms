'use strict';

var mongoose = require('../controllers/connect');

var schema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account'
        }
    ]
});

var notifies = mongoose.model('Notify', schema);
module.exports = notifies;
