'use strict';

var models = ['Account', 'City', 'ClientType', 'Provider', 'Service', 'Department'];

models.forEach(model => {
    module.exports[model] = require('./' + model);
});
