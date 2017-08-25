'use strict';

var views = ['login', 'main', 'users', 'user', 'profile', 'handbook', 'departments/list', 'departments/create', 'departments/item', 'orders/init'];

views.forEach(view => {
    module.exports[view] = require('./' + view);
});
