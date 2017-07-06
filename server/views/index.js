'use strict';

var views = ['login', 'main', 'users', 'add_account', 'user'];

views.forEach(view => {
    module.exports[view] = require('./' + view);
});
