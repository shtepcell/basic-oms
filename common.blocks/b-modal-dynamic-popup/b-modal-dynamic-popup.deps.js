([
    {
        shouldDeps: [
            'i-bem-dom',
            'jquery',
            'button',
            {
                block: 'modal',
                mods: {
                    theme: 'islands',
                    closable: true
                }
            },
            {
                block: 'b-modal-dynamic-popup',
                elem: 'loader'
            }
        ]
    },
    {
        tech: 'js',
        shouldDeps: [
            {
                block: 'modal',
                mods: {
                    theme: 'islands'
                }
            }
        ]
    }
])