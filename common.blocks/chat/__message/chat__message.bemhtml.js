block('chat').elem('message').content()(function () {
    var ctx = this.ctx;

    return [
        {
            block: 'chat',
            elem: 'mess-container',
            content: [
                {
                    block: 'chat',
                    elem: 'author',
                    content: ctx.author
                },
                {
                    block: 'chat',
                    elem: 'text',
                    content: ctx.text
                }
            ]
        },
        {
            block: 'chat',
            elem: 'time',
            content: ctx.time
        },
    ]
})
