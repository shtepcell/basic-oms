block('order').elem('service-info').elemMod('type', 'iptv').content()(function () {
    return [
        {
            elem: 'body-row',
            content: [
                {
                    elem: 'body-row-name',
                    content: 'Связанная заявка'
                },
                {
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'input',
                            mods: {
                                theme: 'islands',
                                width: 'available',
                                size: 'l'
                            },
                            name: 'relation',
                            placeholder: 'ID заказа (1234)'
                        }
                    ]
                }
            ]
        }
    ]
})
