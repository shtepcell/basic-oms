const Order = require('../server/models/Order');
const orders = require('./data');

(async () => {
  for (let i = 0; i < orders.length; i++) {
    const id = orders[i];
    
    const order = await Order.findOne({id: id});

    if (!order) {
      console.log(`Заказ #${id} не найден`);
      continue;
    }

    order.status = 'succes';
    order.deadline = null;
    order.date['succes'] = new Date();
    order.history.push({
      author: 'Робот СУЗ',
      date: new Date(),
      name: 'Заказ включён'
    });

    await order.save().then(() => {
      console.log(`Заказ #${order.id} успешно включен`);
    });
  }
})()
