block('profile-popup').content()(function () {
    var user = this.ctx.user,
        deps = this.ctx.deps;

    return [
        {
            elem: 'part',
            content: [
                {
                    elem: 'info',
                    content: [
                        {
                            elem: 'user-name',
                            content: user.name
                        },
                        {
                            elem: 'user-department',
                            content: user.department.name
                        }
                    ]
                }
            ]
        },
        { elem: 'separator'},
        {
            elem: 'part',
            content: [
                {
                    block: 'link',
                    mods: { theme: 'islands', size: 'l'},
                    mix: { block: 'profile-popup', elem: 'item' },
                    content: 'Данные пользователя',
                    url: '/profile'
                },
                {
                    block: 'link',
                    mods: { theme: 'islands', size: 'l'},
                    mix: [
                        { block: 'profile-popup', elem: 'item' },
                        {
                            block: 'action',
                            elem: 'open-modal',
                            js: true
                        }
                    ],
                    content: [
                        'Настройка главной страницы',
                        {
                            block: 'modal',
                            mods: { theme: 'islands', autoclosable: true },
                            content: { block: 'settings', mods: {tab: 'main-page'}, deps: deps, user: user }
                        }
                    ]
                },
                {
                    block: 'link',
                    mods: { theme: 'islands', size: 'l' },
                    mix: [
                        { block: 'profile-popup', elem: 'item' },
                        {
                            block: 'action',
                            elem: 'open-modal',
                            js: true
                        }
                    ],
                    content: [
                        'Настройка таблиц',
                        {
                            block: 'modal',
                            mods: { theme: 'islands', autoclosable: true  },
                            content: { block: 'settings', mods: {tab: 'table'}, user: user }
                        }
                    ]
                },
                {
                    block: 'link',
                    mods: { theme: 'islands', size: 'l' },
                    mix: [
                        { block: 'profile-popup', elem: 'item' },
                        {
                            block: 'action',
                            elem: 'open-modal',
                            js: true
                        }
                    ],
                    content: [
                        'Настройка уведомлений',
                        {
                            block: 'modal',
                            mods: { theme: 'islands', autoclosable: true },
                            content: { block: 'settings', mods: {tab: 'notify'}, user: user }
                        }
                    ]
                },
                // {
                //     block: 'link',
                //     mods: { theme: 'islands', size: 'l' },
                //     mix: [
                //         { block: 'profile-popup', elem: 'item' },
                //         {
                //             block: 'action',
                //             elem: 'open-modal',
                //             js: true
                //         }
                //     ],
                //     content: [
                //         'Изменить пароль',
                //         {
                //             block: 'modal',
                //             mods: { theme: 'islands' },
                //             content: { block: 'settings', mods: {tab: 'password'} }
                //         }
                //     ]
                // }
            ]
        },
        { elem: 'separator'},
        {
            elem: 'part',
            content: [
                {
                    block: 'link',
                    mods: { theme: 'islands', size: 'l'},
                    mix: { block: 'profile-popup', elem: 'item', elemMods: {color: 'red'} },
                    url: '/logout',
                    content: 'Выйти из системы'
                }
            ]
        }
    ]
})
