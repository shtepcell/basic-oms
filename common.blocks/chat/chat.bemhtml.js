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
                js: {
                    anchor: ctx.order.id
                }
            }
        },
        {
            elem: 'editor',
            users: ctx.users,
            me: ctx.me,
            anchor: ctx.order.id
        }
    ]
})
