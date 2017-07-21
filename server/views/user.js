module.exports = function(opt) {
    var info = {
        create: {
            title: 'Создание пользователя',
            description: 'Страница редактирования пользователя',
            action: '/admin/users/add'
        },

        edit: {
            title: 'Пользователь ',
            description: 'Страница редактирования пользователя',
            action: '/admin/users/'
        },

        profile: {
            title: 'Мой профиль',
            description: 'Страница редактирования профиля',
            action: '/profile'
        }
    }

    if(opt.type == 'edit') {
        info.edit.title+= opt.login;
        info.edit.action+= opt.login
    }

    var passwordForm = {};
    if(opt.type != 'create')
        passwordForm = {
            block: 'form',
            mods: {
                type: 'password'
            },
            mix: {
                block: 'form',
                elem: 'user'
            },
            type: opt.type,
            action: info[opt.type].action+'/password'
        };

    return {
        view: 'page-index',
        title: info[opt.type].title,
        meta: {
            description: info[opt.type].description,
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
                type: opt.type
            },
            {
                block: 'form',
                mods: {
                    type: 'user'
                },
                mix: {
                    block: 'form',
                    elem: 'user'
                },
                type: opt.type,
                action: info[opt.type].action
            },
            passwordForm
        ]
    };
};
