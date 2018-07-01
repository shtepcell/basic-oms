block('orders-table').elem('title').content()(function () {
    return 'Количество заказов: ' + this.ctx.count;
})
