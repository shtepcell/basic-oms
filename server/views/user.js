module.exports = function(opt, data) {
    var user = data.user,
        page = opt.page,
        deps = data.departments;

    var url,
        title;
    switch (page) {
        case 'create':
            url = '/admin/users/add';
            title = 'Создание пользователя';
            break;
        case 'profile':
            url = '/profile';
            title = 'Настройки';
            break;
        case 'edit':
            url = '/admin/users';
            title = `Редактирование пользователя ${user.login}`;
            break;
    }
    return {
        view: 'page-index',
        title: title,
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
                url: url,
                user: user,
                page: page,
                deps: deps
            }
        ]
    }
};
