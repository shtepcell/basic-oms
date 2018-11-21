const Order = require('../server/models/Order');

(async () => {
  const now = new Date();
  now.setDate(now.getDate() - 90);

  let orders = await Order.find({
      isArchive: { $ne: true }
  });

  if (orders.length > 0) {
    for (var i = 0; i < orders.length; i++) {
        const order = orders[i];
        
        order.isArchive = (order.lastModified <= now);
        
        order.save();
    }
  }

  setTimeout(function() {
    process.exit(0);
  }, 3000);

})();
