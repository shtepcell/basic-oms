({
    shouldDeps: [
        {
            block: 'form',
            elem: 'login'
        },
        {
            block: 'form',
            mods: {
                type: 'user'
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
            block: 'table',
            elem: 'common'
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
            block: 'handbook-table',
            mod: 'type',
            val: 'cities'
        }
    ]
})
