block('chat').content()(function () {
    var ctx = this.ctx;
    return [
        {
            elem: 'header',
            content: [
                {
                    elem: 'title',
                    content: 'Переговорная'
                },
                `#${ctx.order.id}`
            ]
        },
        {
            elem: 'body',
            content: {
                elem: 'loader',
                js: true
            }
        },
        {
            elem: 'editor'
        }
    ]
})
