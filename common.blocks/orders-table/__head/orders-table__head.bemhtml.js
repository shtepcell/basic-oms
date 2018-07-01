block('orders-table').elem('head')(
    content()(function () {
        return [{
            block: 'orders-table',
            elem: 'th',
            content: [
                {
                    block: 'orders-table',
                    elem: 'td',
                    elemMods: {
                        type: 'id'
                    },
                    content: 'ID'
                },
                {
                    block: 'orders-table',
                    elem: 'td',
                    elemMods: {
                        type: 'client'
                    },
                    content: 'Клиент'
                },
                {
                    block: 'orders-table',
                    elem: 'td',
                    elemMods: {
                        type: 'status'
                    },
                    content: 'Статус'
                },
                {
                    block: 'orders-table',
                    elem: 'td',
                    elemMods: {
                        type: 'service'
                    },
                    content: 'Услуга'
                },
                {
                    block: 'orders-table',
                    elem: 'td',
                    elemMods: {
                        type: 'adress'
                    },
                    content: 'Адрес'
                },
                {
                    block: 'orders-table',
                    elem: 'td',
                    elemMods: {
                        type: 'cs'
                    },
                    content: 'КС'
                }
            ]
        }]
    })
)
