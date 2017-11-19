module.exports = function(opt, data) {
    var user = opt.user;
    var hasInfo = !!user;
    var deps = data.departments;

    if(!hasInfo) {
        user = {}
    }
    var info = {
        create: {
            title: 'Создание пользователя',
            text: 'Создать',
            description: 'Страница редактирования пользователя',
            action: '/admin/users/add'
        },

        edit: {
            title: 'Пользователь ',
            text: 'Сохранить',
            description: 'Страница редактирования пользователя',
            action: '/admin/users/'
        },

        profile: {
            title: 'Мой профиль',
            text: 'Сохранить',
            description: 'Страница редактирования профиля',
            action: '/profile'
        }
    }

    if(opt.type == 'edit') {
        info.edit.title+= user.login;
        info.edit.action+= user.login;
    }

    var passwordForm = {};
    if(opt.type != 'create')
        passwordForm = {
            block: 'ultra-form',
            action: info[opt.type].action+'/password',
            method: 'POST',
            text: 'Сбросить пароль',
            fields: [
                {
                    name: 'passwordOld',
                    desc: 'Текущий пароль',
                    mods: {
                        type: 'password',
                        maxLenght: 20
                    },
                    required: true,
                    hidden: opt.type != 'profile'
                },
                {
                    name: 'password',
                    desc: 'Новый пароль',
                    required: true,
                    mods: {
                        type: 'password',
                        maxLenght: 20
                    }
                },
                {
                    name: 'passwordRep',
                    desc: 'Подтверждение пароля',
                    required: true,
                    mods: {
                        type: 'password',
                        maxLenght: 20
                    }
                }
            ]
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
                block: 'ultra-form',
                action: info[opt.type].action,
                method: 'POST',
                text: info[opt.type].text,
                fields: [
                    {
                        name: 'login',
                        desc: 'Логин',
                        mods: {
                            type: 'text',
                            maxLenght: 25
                        },
                        required: true,
                        disabled: hasInfo,
                        val: user.login
                    },
                    {
                        name: 'password',
                        desc: 'Пароль',
                        hidden: opt.type != 'create',
                        required: true,
                        mods: {
                            type: 'password',
                            maxLenght: 20
                        }
                    },
                    {
                        name: 'passwordRep',
                        desc: 'Подтверждение пароля',
                        required: true,
                        hidden: opt.type != 'create',
                        mods: {
                            type: 'password',
                            maxLenght: 20
                        }
                    },
                    {
                        name: 'name',
                        desc: 'Ф.И.О.',
                        mods: {
                            type: 'text',
                            maxLenght: 40
                        },
                        required: true,
                        val: user.name
                    },
                    {
                        name: 'email',
                        desc: 'E-mail',
                        mods: {
                            type: 'text',
                            maxLenght: 40
                        },
                        val: user.email
                    },
                    {
                        name: 'phone',
                        desc: 'Телефон',
                        mods: {
                            type: 'text',
                            maxLenght: 40
                        },
                        val: user.phone
                    },
                    {
                        name: 'department',
                        desc: 'Отдел',
                        mods: {
                            type: 'select'
                        },
                        disabled: opt.type == 'profile',
                        val: '' + user.department || 'Без отдела',
                        data: deps.map( item => {
                            return {
                                text: item.name,
                                val: '' + item._id
                            }
                        })
                    }
                ]
            },
            passwordForm
        ]
    };
};
