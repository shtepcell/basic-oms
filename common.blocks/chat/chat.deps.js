({
    shouldDeps: [
        {
            block: 'chat',
            elems: ['header', 'title', 'body', 'editor', 'loader', 'input',
                        'send', 'message', 'recipient']
        },
        {
            block: 'chat',
            elem: 'message',
            mods: {
                'mine': true
            }
        }
    ]
})
