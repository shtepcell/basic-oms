block('fields').mod('type', 'user').content()(function () {
    var info = {
        login: '',
        name: '',
        email: '',
        department: null
    };

    var passwordLabels = [],
        passwordFields = [];
    var hasInfo = (this.ctx.data != null);

    if(hasInfo) {
        info = this.ctx.data;
    } else {
        passwordLabels = [
            {
                block: 'fields',
                elem: 'label',
                content: 'Пароль'
            },
            {
                block: 'fields',
                elem: 'label',
                content: 'Повторите пароль'
            }
        ];
        passwordFields = [
            {
                block: 'fields',
                elem: 'line',
                content: {
                    block: 'input',
                    mods: {
                        theme: 'islands',
                        size: 'm',
                        type: 'password'
                    },
                    required: true,
                    name: 'password',
                    placeholder: 'Пароль'
                }
            },
            {
                block: 'fields',
                elem: 'line',
                content: {
                    block: 'input',
                    mods: {
                        theme: 'islands',
                        size: 'm',
                        type: 'password'
                    },
                    required: true,
                    name: 'passwordRep',
                    placeholder: 'Повторите пароль'
                }
            },
        ]

    }

    return [
        {
            block: 'fields',
            elem: 'title',
            content: [
                {
                    block: 'fields',
                    elem: 'label',
                    content: 'Логин'
                },
                passwordLabels,
                {
                    block: 'fields',
                    elem: 'label',
                    content: 'Ф.И.О'
                },
                {
                    block: 'fields',
                    elem: 'label',
                    content: 'E-mail'
                },
                {
                    block: 'fields',
                    elem: 'label',
                    content: 'Отдел'
                }
            ]
        },
        {
            block: 'fields',
            elem: 'body',
            content: [
                {
                    block: 'fields',
                    elem: 'line',
                    content: {
                        block: 'input',
                        mods: {
                            theme: 'islands',
                            size: 'm',
                            disabled: hasInfo
                        },
                        val: info.login,
                        required: true,
                        name: 'login',
                        placeholder: 'Логин'
                    }
                },
                passwordFields,
                {
                    block: 'fields',
                    elem: 'line',
                    content: {
                        block: 'input',
                        mods: {
                            theme: 'islands',
                            size: 'm'
                        },
                        val: info.name,
                        required: true,
                        name: 'name',
                        placeholder: 'Ф.И.О'
                    }
                },
                {
                    block: 'fields',
                    elem: 'line',
                    content: {
                        block: 'input',
                        mods: {
                            theme: 'islands',
                            size: 'm'
                        },
                        val: info.email,
                        name: 'email',
                        placeholder: 'E-mail'
                    }
                },
                {
                    block: 'fields',
                    elem: 'line',
                    content: {
                        block: 'select',
                        mods: {
                            mode: 'radio',
                            theme: 'islands',
                            size: 'm',
                            disabled: hasInfo
                        },
                        val: info.department,
                        required: true,
                        name: 'department',
                        options: [
                            {
                                val: 1,
                                text: 'Доклад'
                            },
                            {
                                val: 2,
                                text: 'Мастер-класс'
                            },
                            {
                                val: 3,
                                text: 'Круглый стол'
                            }
                        ]
                    }
                }
            ]
        }
    ]
})
