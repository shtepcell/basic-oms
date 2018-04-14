block('navigator').content()(function () {
    var user = this.ctx.user,
        isAdmin = user && (user.department.type == 'admin');

    return [
        {
            block: 'link',
            mods: { theme: 'islands', size : 'l' },
            mix: { block: 'navigator', elem: 'link' },
            url: '/',
            content: (isAdmin)?'Главная страница':'Мои заказы'
        },
        {
            block: 'link',
            mods: { theme: 'islands', size : 'l' },
            mix: { block: 'navigator', elem: 'link' },
            url: '/search',
            content: 'Поиск заказов'
        },
        {
            block: 'link',
            mods: { theme: 'islands', size : 'l' },
            mix: { block: 'navigator', elem: 'link' },
            url: '/status',
            content: 'Статус'
        },
        {
            elem: 'admin-menu',
            elemMods: { display: isAdmin }
        },
        {
            elem: 'right-block',
            content: [
                {
                    block: 'link',
                    mods: { theme: 'islands', size: 'l' },
                    mix: { block: 'navigator', elem: 'link' },
                    url: '/notifies',
                    content: [
                        (user && user.notifies>0)?`(${user.notifies})`:'',
                        {
                            block: 'icon',
                            url: (user && user.notifies>0)?'/alarm.svg':'/alarm-empty.png',
                            mix: (user && user.notifies>0)?'navigator__alarm':''
                        }
                    ]
                },
                {
                    block: 'dropdown',
                    mods: {
                        switcher: 'link',
                        theme: 'islands',
                        size: 'l'
                    },
                    mix: { block: 'navigator', elem: 'link' },
                    switcher: `Мой профиль (${user.login})`,
                    popup: {
                        block: 'profile-popup',
                        user: user
                    }
                }
            ]
        }
    ]
})
