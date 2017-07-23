'use strict';

var models = ['Account', 'City', 'ClientType'];

models.forEach(model => {
    module.exports[model] = require('./' + model);
});
