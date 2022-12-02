block('navigator').content()(function () {
    var user = this.ctx.user,
        deps = this.ctx.deps,
        isAdmin = user && (user.department.type == 'admin'),
        isInit = user && ['b2b', 'b2o'].includes(user.department.type);

    var init = {
        block: 'link',
        mods: { theme: 'islands', size: 'l' },
        mix: { block: 'navigator', elem: 'link' },
        url: '/init',
        content: 'Создать заказ'
    };

    var clients = {
        block: 'link',
        mods: { theme: 'islands', size: 'l' },
        mix: { block: 'navigator', elem: 'link' },
        url: '/admin/clients',
        content: 'Клиенты'
    };

    if (!isInit) clients = undefined;
    if (!isInit) init = undefined;

    return [
        {
            block: 'link',
            mods: { theme: 'islands', size: 'l' },
            mix: { block: 'navigator', elem: 'link' },
            url: '/',
            content: (isAdmin) ? 'Главная страница' : 'Мои заказы'
        },
        init,
        {
            block: 'link',
            mods: { theme: 'islands', size: 'l' },
            mix: { block: 'navigator', elem: 'link' },
            url: '/search',
            content: 'Поиск заказов'
        },
        {
            block: 'link',
            mods: { theme: 'islands', size: 'l' },
            mix: { block: 'navigator', elem: 'link' },
            url: '/status',
            content: 'Статус'
        },
        clients,
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
