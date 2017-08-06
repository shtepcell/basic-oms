'use strict';

var models = ['Account', 'City', 'ClientType', 'Provider', 'Service', 'Department', 'Client'];

models.forEach(model => {
    module.exports[model] = require('./' + model);
});
