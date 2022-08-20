const Order = require('../../models/Order');

const shutdownOrder = async (ids, author) => {
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const order = await Order.findOne({ id: id });

    if (!order) {
      console.warn(`Заказ #${id} не найден`);
      continue;
    }

    order.status = 'shutdown';
    order.deadline = null;
    order.date['shutdown'] = new Date();
    order.history.push({
      author: `Робот СУЗ (по запросу ${author})`,
      date: new Date(),
      name: 'Заказ отключён'
    });

    await order.save()
      .then(() => {
        console.log(`Заказ #${order.id} успешно отключен`);
      })
      .catch((error) => {
        console.error(`Ошибка сохранения #${order.id}`, error)
      });
  }
}

module.exports = { shutdownOrder };
