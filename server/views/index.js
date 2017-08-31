'use strict';

var views = ['login', 'main', 'users', 'user', 'search', 'profile', 'handbook',
                'departments/list', 'departments/create', 'departments/item',
                'orders/init', 'mains/b2b', 'mains/gus'];

views.forEach(view => {
    module.exports[view] = require('./' + view);
});
