'use strict';

var mongoose = require('../controllers/connect');

var schema = mongoose.Schema( {
    name : {
        type : String,
        required : true
    },
    id: {
        type : String,
        unique: true,
        required : true
    }
});

var departmentType = mongoose.model('DepartmentType', schema);
module.exports = departmentType;
