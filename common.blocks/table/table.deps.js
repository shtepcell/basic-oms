({
    shouldDeps: [
        {
            block: 'table',
            elems: ['cell', 'head', 'body', 'row'],
            mods: {
                type: ['notify', 'order'],
                width: 'available'
            }
        },
        {
            block: 'action',
            elems: ['read-notify', 'redirect']
        },
        {
            block: 'icon'
        }
    ]
})
