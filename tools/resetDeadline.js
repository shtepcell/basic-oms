const Order = require('../server/models/Order');

(async () => {

    var orders = await Order.find({status: 'client-match'});

    for (var i = 0; i < orders.length; i++) {
        orders[i].deadline = null;
        orders[i].pause = {
            status: false,
            date: null
        };
        orders[i].save();
    }

    console.log('Done');
    process.exit(1);
})();
