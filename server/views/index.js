'use strict';

var views = [
    'login', 'main', 'users', 'user', 'search', 'handbook',
    'departments/list', 'departments/create', 'departments/item',
    'orders/init', 'orders/order', 'status', 'holidays', 'notifies',
    'orders/change-order', 'testServices', '404',
    'admin/configuration'
];

views.forEach(view => {
    module.exports[view] = require('./' + view);
});
