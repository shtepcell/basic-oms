'use strict';

var models = ['Account', 'City', 'ClientType', 'Provider', 'Service', 'Client'];

models.forEach(model => {
    module.exports[model] = require('./' + model);
});
