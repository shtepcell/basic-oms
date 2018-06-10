block('chat').elem('message').elemMod('mine', true).content()(function () {
    var ctx = this.ctx;

    return [
        {
            block: 'chat',
            elem: 'mess-container',
            content: [
                {
                    block: 'chat',
                    elem: 'text',
                    content: ctx.text
                },
                {
                    block: 'chat',
                    elem: 'time',
                    content: ctx.time
                }
            ]
        }
    ]
})
