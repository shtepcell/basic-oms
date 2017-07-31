module.exports = function(opt, data) {
    var opt = opt || {},
        pagerId;

    var users = data.users;

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
                block: 'title',
                mods: {
                    type: 'user'
                },
                type: 'list'
            },
            {
                block: 'button',
                mods: {
                    theme: 'islands',
                    size: 'm',
                    type: 'link'
                },
                mix: {
                    block: 'button',
                    elem: 'add'
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
                block: 'ultra-table',
                mods: {
                    'static' : true,
                    theme: 'common'
                },
                fields: [
                    {
                        name: 'Логин',
                        field: 'login'
                    },
                    {
                        name: 'Ф.И.О.',
                        field: 'name'
                    },
                    {
                        name: 'E-mail',
                        field: 'email'
                    },
                    {
                        name: 'Телефон',
                        field: 'phone'
                    },
                    {
                        name: 'Отдел',
                        field: 'department'
                    }
                ],
                url: '/admin/users/',
                template: 'login',
                data: users
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
