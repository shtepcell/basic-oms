module.exports = function(opt, data) {
    var user = data.user,
        page = opt.page,
        deps = data.departments;

    return {
        view: 'page-index',
        title: `Пользователь ${user.login}`,
        meta: {
            description: 'СУЗ 2.0',
            og: {
                url: 'https://suz.miranda-media.ru',
                siteName: 'СУЗ 2.0'
            }
        },
        page: [
            {
                block: 'user',
                js: true,
                action: '/profile',
                user: user,
                page: page,
                deps: deps
            }
        ]
    }
};
