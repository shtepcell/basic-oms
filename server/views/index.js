'use strict';

var views = ['login', 'main', 'users', 'add_account'];

views.forEach(view => {
    module.exports[view] = require('./' + view);
});
