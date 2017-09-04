var stages = {
    'init': {
        name: 'Инициация',
        fields: {
            default: [ ],
            fill: [ ]
        },
        next: ['gzp-pre', 'stop-pre', 'all-pre'],
        action: ['init']
    },
    'client-match': {
        name: 'Согласование с клиентом',
        fields: {
            default: [ ],
            fill: [ ]
        },
        next: ['gzp-build', 'stop-build']
    },
    'client-notify': {
        name: 'Уведомление клиента',
        fields: {
            default: [ ],
            fill: [ ]
        },
        next: ['succes']
    },
    'all-pre': {
        name: 'Проработка по ГЗП и STOP',
        fields: {
            default: [ ],
            fill: [ ]
        },
        next: ['client-match']

    },
}
