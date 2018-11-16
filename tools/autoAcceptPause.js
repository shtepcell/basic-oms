const Order = require('../server/models/Order');

(async () => {
  const now = new Date();
  now.setDate(now.getDate()-3);

  let orders = await Order.find({
    'requestPause.status': true,
    'requestPause.date': {
      $lte : now
    }
  });

  if (orders.length > 0) {
    for (var i = 0; i < orders.length; i++) {

      orders[i].pause = {
        status: true,
        date: orders[i].requestPause.date
      }

      orders[i].requestPause = {
        status: false,
        date: null,
        user: null
      }

      orders[i].history.push({
         author: 'Робот СУЗ',
         date: new Date(),
         name: 'Автоматическое подтверждение паузы'
      })

      let ok = await orders[i].save();
    }
  }

  process.exit(0);
})();
