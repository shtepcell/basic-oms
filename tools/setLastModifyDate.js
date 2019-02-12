const Order = require('../server/models/Order');
	
(async () => {

    let orders = await Order.find({});

    if (orders.length > 0) {
        for (var i = 0; i < orders.length; i++) {
            let last = orders[i].history[orders[i].history.length - 1].date;

            orders[i].lastMod = last;
            orders[i].isEditing = true;

            orders[i].save();
            console.log('Saved');   
        }
    }

})();