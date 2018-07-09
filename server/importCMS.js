var db = require('./controllers/connect');

var orders = require('./cms'),
    Order = require('./models/Order');

(async () => {


    for (var i = 0; i < orders.length; i++) {
        var order = await Order.findOne({id: orders[i].id});
        if(order) {
            order.info.cms = orders[i].cms;
            order.save();
        }
    }

    setTimeout(function () {
        process.exit(0);
    }, 2000);

})();
