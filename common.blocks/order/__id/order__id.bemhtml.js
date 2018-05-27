block('order').elem('id').content()(function () {
    var id = this.ctx.id;

    return [
        {
            elem: 'id-title',
            content: 'Заказ'
        },
        {
            elem: 'id-number',
            content: `#${id}`
        }
    ]
})
