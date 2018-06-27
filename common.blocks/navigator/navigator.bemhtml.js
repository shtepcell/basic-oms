block('navigator').content()(function () {
    var user = this.ctx.user,
        deps = this.ctx.deps,
        isAdmin = user && (user.department.type == 'admin'),
        isInit = user && (user.department.type == 'b2b' || user.department.type == 'b2o');

    var init = {
        block: 'link',
        mods: { theme: 'islands', size : 'l' },
        mix: { block: 'navigator', elem: 'link' },
        url: '/init',
        content: 'Инициация заказа'
    };
    if(!isInit) init = undefined;
    return [
        {
            block: 'link',
            mods: { theme: 'islands', size : 'l' },
            mix: { block: 'navigator', elem: 'link' },
            url: '/',
            content: (isAdmin)?'Главная страница':'Мои заказы'
        },
        init,
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
                    block: 'bell',
                    user: user
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
                        user: user,
                        deps: deps
                    }
                }
            ]
        }
    ]
})
