([
    {
        mustDeps: 'i-bem-dom',
        shouldDeps: [
            'button',
            'jquery',
            'select',
            'input',
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
                block: 'handbook-table',
                elem: 'row',
                mods: {
                    type: 'client-types'
                },
                tech: 'bemhtml'
            },
            {
                block: 'handbook-table',
                elem: 'row',
                mods: {
                    type: 'providers'
                },
                tech: 'bemhtml'
            },
            {
                block: 'handbook-table',
                elem: 'row',
                mods: {
                    type: 'services'
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
            },
            {
                block: 'button',
                mods: {
                    theme: 'islands',
                    size: 's'
                },
                tech: 'bemhtml'
            }
        ]
    }
]);
