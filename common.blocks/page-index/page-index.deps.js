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
            block: 'form',
            mods: {
                type: 'password'
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
        },
        {
            block: 'handbook-table',
            mod: 'type',
            val: 'client-types'
        },
        {
            block: 'ultra-form'
        },
        {
            block: 'ultra-form',
            elem: 'cell'
        },
        {
            block: 'ultra-form',
            elem: 'row'
        },
        {
            block: 'inline-form',
            mods: {
                type:  'cities'
            }
        },
        {
            block: 'inline-form',
            mods: {
                type:  'client-types'
            }
        }
    ]
})
