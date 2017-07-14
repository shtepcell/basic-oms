'use strict';

var models = ['Account', 'City'];

models.forEach(model => {
    module.exports[model] = require('./' + model);
});
