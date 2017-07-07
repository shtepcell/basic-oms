({
    shouldDeps: [
        {
            block: 'form',
            mods: {
                type: ['login', 'user']
            }
        },
        {
            block: 'title',
            mods: {
                type: ['login', 'user']
            }
        },
        {
            block: 'table',
            mods: {
                users: true
            }
        },
        {
            block: 'button',
            mods: {
                theme: 'islands',
                size: 'm',
                type: 'link'
            }
        },
        {
            block: 'select',
            mods: {
                mode: 'radio',
                theme: 'islands',
                size: 'm'
            }
        },
        {
            block: 'pager'
        },
        {
            block: 'popup',
            mods: {
                type: 'notify'
            }
        }
    ]
})
