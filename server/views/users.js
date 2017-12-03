module.exports = function(opt, data) {
    var opt = opt || {},
        pagerId;

    var query = data.query || {};
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
                    lvl: '3'
                },
                content: 'Учетные записи СУЗ'
            },
            {
                block: 'short-search',
                url: opt.reqUrl+'/search',
                query: query
            },
            {
                block: 'button-panel',
                user: data.__user,
                type: 'admin'
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
                        getContent: (item) => `${item.name}`
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
