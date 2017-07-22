'use strict';

var models = ['Account', 'City', 'Provider'];

models.forEach(model => {
    module.exports[model] = require('./' + model);
});
