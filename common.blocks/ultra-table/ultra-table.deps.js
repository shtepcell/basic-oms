({
    shouldDeps: [
        {
            block: 'ultra-table',
            elems: ['cities', 'delete', 'holidays']
        },
        {
            block: 'ultra-table',
            mods: {
                theme: ['common', 'order']
            }
        },
        'thead',
        'tbody',
        {
            block: 'colored-text',
            mods: {
                type: ['green', 'red']
            }
        }
    ]
})
