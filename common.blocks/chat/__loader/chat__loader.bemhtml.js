block('chat').elem('loader').content()(function () {
    return [
        {tag: 'span', content: 'Загрузка сообщений...'},
        {
            block: 'spin',
            mods: {
                theme: 'islands',
                size: 'xl',
                visible: true
            }
        }
    ]
})
