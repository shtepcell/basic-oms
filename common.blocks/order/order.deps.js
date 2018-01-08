({
    shouldDeps: [
        'b-modal-dynamic-popup',
        {
            elems: ['head', 'body', 'head-cell', 'cell-name', 'cell-data', 'tab', 'body-row', 'body-row-name', 'body-row-data', 'separator', 'actions']
        },
        {
            block: 'attach',
            mods: {
                theme: 'islands'
            }
        },
        {
            block: 'select',
            elem: 'service'
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
