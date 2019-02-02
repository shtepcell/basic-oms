({
    shouldDeps: [
        {
            block: 'searcher',
            elems: ['cell', 'row', 'label', 'group', 'actions', 'form']
        },
        {
            block: 'input',
            mods: {
                type: ['text', 'cms'],
                theme: 'islands',
                size: 'm'
            }
        },
        {
            block: 'select',
            mods: {
                mode: 'radio-check',
                theme: 'islands',
                size: 'l',
                width: 'available'
            }
        },
        {
            block: 'checkbox-group',
            mods: {
                theme: 'islands',
                size: 'm',
                type: 'button'
            }
        }
    ]
})
