([
    {
        mustDeps: 'i-bem-dom',
        shouldDeps: [
            'button',
            'jquery',
            'select',
            {
                block: 'handbook-table',
                elems: ['cell']
            },
            {
                block: 'button',
                mods: [
                    'theme',
                    'size',
                    'disabled'
                ]
            },
            {
                block: 'select',
                mods: {
                    theme: 'islands',
                    size: 's',
                    mode: 'radio'
                }
            },
            {
                block: 'input',
                mods: {
                    theme: 'islands',
                    size: 's'
                }
            }
        ]
    },
    {
        tech: 'js',
        shouldDeps: [
            {
                block: 'handbook-table',
                elem: 'row',
                mods: {
                    type: 'cities'
                },
                tech: 'bemhtml'
            },
            {
                block: 'select',
                elem: 'row',
                mods: {
                    theme: 'islands',
                    size: 's',
                    mode: 'radio'
                },
                tech: 'bemhtml'
            },
            {
                block: 'input',
                mods: {
                    theme: 'islands',
                    size: 's'
                },
                tech: 'bemhtml'
            }
        ]
    }
]);