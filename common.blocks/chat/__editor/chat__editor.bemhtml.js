block('chat').elem('editor').content()(function () {
    return [
        {
            block: 'textarea',
            mix: {
                block: 'chat',
                elem: 'input'
            },
            mods: {
                theme: 'islands',
                size: 'l'
            },
            placeholder: 'Введите сообщение... Но отправить Вы его не сможете. Чат в разработке :)'
        },
        {
            block: 'button',
            mix: {
                block: 'chat',
                elem: 'send'
            },
            mods: {
                theme: 'islands',
                size: 'l'
            },
            text: 'Отправить'
        }
    ]
})
