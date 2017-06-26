block('navigator').content()(function() {
    var nav = [
        {
            block: 'link',
            content: 'Главная',
            mods: {
                theme: 'islands',
                nav: true
            },
            url: '/'
        },
        {
            block: 'link',
            content: 'Поиск заявок',
            mods: {
                nav: true,
                theme: 'islands'
            },
            url: '/search'
        },
        {
            block: 'link',
            content: 'Статус',
            mods: {
                theme: 'islands',
                nav: true
            },
            url: '/status'
        }
    ];

    var end = [
        {
            block: 'link',
            content: 'Выйти',
            mods: {
                theme: 'islands',
                nav: true,
                end: true
            },
            url: '/logout'
        },
        {
            block: 'link',
            content: '[' + this.data.locals.__user.login + ']',
            mods: {
                theme: 'islands',
                nav: true,
                end: true
            },
            url: '/profile'
        }
    ]

    if(this.data.locals.__user) {
        nav.push({
            block: 'dropdown',
            mods: {
                switcher: 'link',
                theme: 'islands',
                size: 'm'
            },
            switcher: 'Администрирование',
            popup: [
                {
                    block: 'link',
                    content: 'Учетные записи',
                    mods: {
                        theme: 'islands'
                    },
                    url: '/admin/users'
                }
            ]
        })
    }

    nav.push(end);
    return nav;

})
