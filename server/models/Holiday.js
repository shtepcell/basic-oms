'use strict';

var mongoose = require('../controllers/connect');

var schema = mongoose.Schema( {
    date: {
        type: Date,
        required: true,
        unique: true
    }
});

var holidays = mongoose.model('Holiday', schema);
module.exports = holidays;
