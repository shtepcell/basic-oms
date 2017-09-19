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
                        getContent: (item) => `${item.login}`
                    },
                    {
                        name: 'Ф.И.О.',
                        getContent: (item) => `${item.login}`
                    },
                    {
                        name: 'E-mail',
                        getContent: (item) => `${item.email}`
                    },
                    {
                        name: 'Телефон',
                        getContent: (item) => `${item.phone}`
                    },
                    {
                        name: 'Отдел',
                        getContent: (item) => `${item.department.name}`
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
