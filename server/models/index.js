'use strict';

var models = ['Account', 'City', 'Street', 'ClientType', 'Provider', 'Service', 'Department', 'Client'];

models.forEach(model => {
    module.exports[model] = require('./' + model);
});
