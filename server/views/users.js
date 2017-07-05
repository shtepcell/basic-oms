module.exports = function(opt) {
    var opt = opt || {},
        pagerId;

    if (opt.pagers && opt.pagers.length)
        pagerId = opt.pagers[0];

    return {
        view: 'page-index',
        title: 'Пользователи СУЗ',
        meta: {
            description: 'СУЗ 2.0',
            og: {
                url: 'https://suz.miranda-media.ru',
                siteName: 'СУЗ 2.0'
            }
        },
        page: [
            {
                block: 'button',
                mods: {
                    theme: 'islands',
                    size: 'm',
                    type: 'link'
                },
                url: '/admin/users/add',
                icon: {
                    block: 'icon',
                    url: '/add.svg',
                    mix: 'button__icon'
                },
                text: 'Создать пользователя'
            },
            {
                block: 'table',
                mods: {
                    users: true
                }
            },
            {
                block: 'pager',
                attrs: {
                    id: pagerId
                }
            }
        ]
    };
};
