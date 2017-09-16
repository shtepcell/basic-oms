'use strict';

var views = ['login', 'main', 'users', 'user', 'search', 'handbook',
                'departments/list', 'departments/create', 'departments/item',
                'orders/init', 'orders/order', 'mains/b2b', 'mains/gus', 'mains/net'];

views.forEach(view => {
    module.exports[view] = require('./' + view);
});
