'use strict';

var mongoose = require('../controllers/connect'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate');

var schema = Schema( {
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    anchor: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true,
        default: new Date()
    }
});

var chat = mongoose.model('Chat', schema);
module.exports = chat;
