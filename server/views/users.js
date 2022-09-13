module.exports = function(opt, data) {
    var query = data.query || {};
    var users = data.users;
    
    return {
        view: 'page-index',
        title: 'Пользователи СУЗ',
        meta: {
            description: 'СУЗ 2.0',
            og: {
                url: process.env.PROJECT_HOST,
                siteName: 'СУЗ 2.0'
            }
        },
        page: [
            {
                block: 'title',
                mods: {
                    lvl: '3'
                },
                content: 'Учетные записи'
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
                        getContent: (item) => {
                            let type = null;

                            item.isOnline && (type = 'green');

                            return {
                                block: 'colored-text',
                                mods: { type },
                                content: `${item.login}`
                            }
                        },
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
            }
        ]
    };
};
