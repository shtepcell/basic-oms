'use strict';

var models = ['Account', 'City', 'ClientType', 'Provider'];

models.forEach(model => {
    module.exports[model] = require('./' + model);
});
