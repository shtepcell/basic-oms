'use strict';

var views = ['login', 'main', 'users', 'user'];

views.forEach(view => {
    module.exports[view] = require('./' + view);
});
