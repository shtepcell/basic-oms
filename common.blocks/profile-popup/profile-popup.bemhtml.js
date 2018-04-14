block('profile-popup').content()(function () {
    var user = this.ctx.user;

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
                    mods: { theme: 'islands', size: 'l', disabled: true},
                    mix: { block: 'profile-popup', elem: 'item'},
                    content: 'Настройка таблиц'
                },
                {
                    block: 'link',
                    mods: { theme: 'islands', size: 'l', disabled: true},
                    mix: { block: 'profile-popup', elem: 'item'},
                    content: 'Сброс пароля'
                },
                {
                    block: 'link',
                    mods: { theme: 'islands', size: 'l'},
                    mix: { block: 'profile-popup', elem: 'item'},
                    content: 'Изменение информации',
                    url: '/profile'
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
                    mix: { block: 'profile-popup', elem: 'item', elemMods: {color: 'red'}},
                    url: '/logout',
                    content: 'Выйти из системы'
                }
            ]
        }
    ]
})
