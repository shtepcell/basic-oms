'use strict';

var models = ['Account', 'City', 'ClientType', 'Provider', 'Service', 'DepartmentType', 'Department'];

models.forEach(model => {
    module.exports[model] = require('./' + model);
});
