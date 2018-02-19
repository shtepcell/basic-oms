block('chat').elem('editor').content()(function () {
    return [
        {
            block: 'textarea',
            mix: {
                block: 'chat',
                elem: 'input',
                js: true
            },
            mods: {
                theme: 'islands',
                size: 'l'
            },
            placeholder: 'Введите сообщение...'
        },
        {
            block: 'button',
            mix: {
                block: 'chat',
                elem: 'send',
                js: {
                    anchor: this.ctx.anchor
                }
            },
            mods: {
                theme: 'islands',
                size: 'l',
                disabled: true
            },
            text: 'Отправить'
        }
    ]
})
