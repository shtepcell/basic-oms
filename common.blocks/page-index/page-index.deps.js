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
            block: 'handbook-table',
            mod: 'type',
            val: 'providers'
        },
        {
            block: 'handbook-table',
            mod: 'type',
            val: 'services'
        },
        {
            block: 'handbook-table',
            mod: 'type',
            val: 'clients'
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
            block: 'ultra-form',
            elem: 'label'
        },
        {
            block: 'ultra-form',
            mods: {
                theme: 'order'
            }
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
        },
        {
            block: 'inline-form',
            mods: {
                type:  'providers'
            }
        },
        {
            block: 'inline-form',
            mods: {
                type:  'services'
            }
        },
        {
            block: 'inline-form',
            mods: {
                type:  'clients'
            }
        },
        {
            block: 'ultra-table',
            elem: 'cities'
        },
        {
            block: 'ultra-table',
            mods: {
                theme: 'common'
            }
        },
        {
            block: 'suggest',
            mods: {
                theme: 'islands',
                size: 'l',
                'has-dataprovider': 'adress'
            }
        },
        {
            block: 'title',
            elem: 'part'
        },
        {
            block: 'ultra-table',
            elem: 'delete'
        }
    ]
})
