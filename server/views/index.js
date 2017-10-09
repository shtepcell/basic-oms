'use strict';

var views = ['login', 'main', 'users', 'user', 'search', 'handbook', 'dev',
                'departments/list', 'departments/create', 'departments/item',
                'orders/init', 'orders/order', 'mains/b2b', 'mains/gus', 'mains/net',
                'mains/stop', 'status', 'holidays'];

views.forEach(view => {
    module.exports[view] = require('./' + view);
});
