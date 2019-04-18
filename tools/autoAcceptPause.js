const moment = require('moment');
const Order = require('../server/models/Order');

const today = moment().format("MMM D YYYY, HH:mm:ss");

console.log(`################# ${today} #################`);
console.log();

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

      console.log(`Заказ #${orders[i].id} поставлен на паузу`);

      let ok = await orders[i].save();
    }
  }

  console.log();
  console.log();
  console.log();

  process.exit(0);
})();