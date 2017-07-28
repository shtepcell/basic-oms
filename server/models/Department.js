'use strict';

var mongoose = require('../controllers/connect');

var schema = mongoose.Schema( {
    name: {
        type: String,
        required:  true
    },
    type: {
        type : mongoose.Schema.Types.ObjectId, ref: 'DepartmentTypes',
        required:  true
    }
});

var department = mongoose.model('Department', schema);
module.exports = department;
