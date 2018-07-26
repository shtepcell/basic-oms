({
    shouldDeps: [
        'b-modal-dynamic-popup',
        'gavno__vkusnoe',
        {
            elems: ['head', 'cell-name', 'cell-data', 'tab', 'control',
             'body-row', 'body-row-name', 'body-row-data', 'separator', 'actions',
            'switcher', 'id', 'cs', 'flag', 'clipboard']
        },
        {
            block: 'order',
            elem: 'head-cell',
            mods: {
                type: ['left', 'right', 'top', 'bottom', 'center']
            }
        },
        {
            block: 'order',
            elem: 'action',
            mods: {
                type: ['add-param', 'submit', 'redirect']
            }
        },
        {
            block: 'order',
            elem: 'actions',
            mods: {
                tab: ['info', 'gzp', 'stop', 'sks']
            }
        },
        {
            block: 'order',
            elem: 'body',
            mods: {
                tab: ['init', 'info', 'gzp', 'stop', 'sks', 'history']
            }
        },
        {
            block: 'order',
            elem: 'service-info',
            mods: {
                type: ['internet', 'vpls', 'l3vpn', 'l2vpn', 'iptv']
            }
        },
        {
            block: 'order',
            elem: 'adress-info',
            mods: {
                type: ['location', 'coordination']
            }
        },
        {
            block: 'order',
            elem: 'stop-info',
            mods: {
                capability: ['yes', 'no']
            }
        },
        {
            block: 'order',
            elem: 'gzp-info',
            mods: {
                need: ['yes', 'no']
            }
        },
        {
            block: 'order',
            elem: 'capability',
            mods: {
                type: ['yes', 'no']
            }
        },
        {
            block: 'attach',
            mods: {
                theme: 'islands'
            }
        },
        {
            block: 'select',
            elem: ['service', 'volume', 'ip']
        },
        {
            block: 'input',
            mods: {
                'has-calendar': true,
                size: 'm',
                theme: 'islands'
            },
            weekdays: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
            months: ['Январь', 'Февраль', 'Март',
                'Апрель', 'Май', 'Июнь',
                'Июль', 'Август', 'Сентябрь',
                'Октябрь', 'Ноябрь', 'Декабрь']
        }

    ]
})
