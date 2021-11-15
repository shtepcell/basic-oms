const Order = require('../server/models/Order');
const orders = require('./data');
const helper = require('../server/controllers/helper');

(async () => {
  for (let i = 0; i < orders.length; i++) {
    const id = orders[i];
    
    const order = await Order.findOne({id: id});

    if (!order) {
      console.log(`Заказ #${id} не найден`);
      continue;
    }

    if (order.date['stop-build'] != null) {
      order.status = 'stop-shutdown';
    } else {
      order.status = 'pre-shutdown';
    }

    order.deadline = await helper.calculateDeadline(3);
    
    order.history.push({
      author: 'Робот СУЗ',
      date: new Date(),
      name: 'Изменен этап -> Запрос отключения услуги'
    });

    await order.save().then(() => {
      console.log(`Заказ #${order.id} успешно направлен на отключение`);
    });
  }
})()
