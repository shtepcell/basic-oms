'use strict';

var mongoose = require('../controllers/connect');

var schema = mongoose.Schema( {
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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'City'
        }
    ]
});

var department = mongoose.model('Department', schema);
module.exports = department;
