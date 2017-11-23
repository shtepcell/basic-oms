block('user').content()(function () {
    var ctx = this.ctx,
        user = ctx.user,
        page = ctx.page,
        deps = ctx.deps;

    var fields = {
        info: [
            {
                text: 'Логин',
                val: user.login,
                access: page == 'create',
                show: page == 'profile' || page == 'user',
                input: {
                    type: 'text',
                    name: 'login',
                    placeholder: 'example'
                }
            },
            {
                text: 'Ф.И.О.',
                val: user.name,
                access: true,
                show: true,
                input: {
                    type: 'text',
                    name: 'name',
                    placeholder: 'Иванов Иван Иванович'
                }
            },
            {
                text: 'E-mail',
                val: user.email,
                access: true,
                show: true,
                input: {
                    type: 'text',
                    name: 'email',
                    placeholder: 'example@miranda-media.ru'
                }
            },
            {
                text: 'Телефон',
                val: user.phone,
                access: true,
                show: true,
                input: {
                    type: 'text',
                    name: 'phone',
                    placeholder: '+79787654321'
                }
            },
            {
                text: 'Отдел',
                val: user.department.name,
                access: page != 'profile',
                show: true,
                input: {
                    type: 'select',
                    name: 'department',
                    data: deps
                }
            }
        ],
        password: [
            {
                text: 'Старый пароль',
                val: '',
                access: true,
                show: page == 'profile',
                input: {
                    type: 'password',
                    name: 'oldpass'
                }
            },
            {
                text: 'Новый пароль',
                val: '',
                access: true,
                show: page != 'create',
                input: {
                    type: 'password',
                    name: 'newpass'
                }
            },
            {
                text: 'Повторите новый пароль',
                val: '',
                access: true,
                show: page != 'create',
                input: {
                    type: 'password',
                    name: 'repeatpass'
                }
            },
            {
                text: 'Пароль',
                val: '',
                access: true,
                show: page == 'create',
                input: {
                    type: 'password',
                    name: 'password'
                }
            },
            {
                text: 'Повторите пароль',
                val: '',
                access: true,
                show: page == 'create',
                input: {
                    type: 'password',
                    name: 'repeatpass'
                }
            }
        ],
        other: [

        ]
    }

    var ret = [];

    fields.info.forEach( item => {
        if(item.show) {
            if(item.access) {
                ret.push({
                    elem: 'row',
                    content: [
                        {
                            elem: 'cell',
                            content: item.text
                        },
                        {
                            elem: 'cell',
                            content: {
                                elem: 'input',
                                val: item.val,
                                placeholder: item.input.placeholder,
                                type: item.input.type,
                                name: item.input.name
                            }
                        }
                    ]
                })
            } else {
                ret.push({
                    elem: 'row',
                    content: [
                        {
                            elem: 'cell',
                            content: item.text
                        },
                        {
                            elem: 'cell',
                            content: item.val
                        }
                    ]
                })
            }
        }
    })

    ret.push({
        elem: 'row',
        mix: {
            block: 'user',
            elem: 'row-without-underline'
        },
        content: [
            {
                elem: 'cell'
            },
            {
                elem: 'cell',
                content: 'Раздел находится в разработке, возможна нестабильная работа. В скором времени будут доступны расширенные настройки...'
            }
        ]
    })

    ret.push({
        elem: 'row',
        mix: {
            block: 'user',
            elem: 'row-without-underline'
        },
        content: [
            {
                elem: 'cell'
            },
            {
                elem: 'cell',
                content: {
                    block: 'button',
                    mods: {
                        theme: 'islands',
                        size: 'm',
                        type: 'submit'
                    },
                    text: 'Сохранить изменения'
                }
            }
        ]
    })


    return [
        {
            block: 'title',
            mods: {
                lvl: '3'
            },
            content: 'Настройки пользователя'
        },
        ret
    ];
});
