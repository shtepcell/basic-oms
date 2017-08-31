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
                block: 'button-panel',
                type: 'users'
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
                        field: ['department', 'name']
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
