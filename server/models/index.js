'use strict';

var models = ['Account', 'City', 'ClientType', 'Provider', 'Service'];

models.forEach(model => {
    module.exports[model] = require('./' + model);
});
