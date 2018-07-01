block('orders-table').elem('tr').content()(function () {
    var ctx = this.ctx;
    return [
        {
            block: 'link',
            url: '/order/'+ctx.url,
            content: [
                ctx.content
            ]
        }

    ]

})
