block('form').mod('userAdd')(
    attrs()({
        method: 'POST',
        action: '/admin/users/add'
    }),
    content()(function () {
        return [
            {
                block: 'control-group',
                content: [
                    {
                        block: 'input',
                        mods: {
                            theme: 'islands',
                            size: 'm'
                        },
                        name: 'login',
                        placeholder: 'Логин'
                    },
                    {
                        block: 'input',
                        mods: {
                            theme: 'islands',
                            size: 'm',
                            type: 'password'
                        },
                        name: 'password',
                        placeholder: 'Пароль'
                    },
                    {
                        block: 'input',
                        mods: {
                            theme: 'islands',
                            size: 'm',
                            type: 'password'
                        },
                        name: 'passwordRep',
                        placeholder: 'Повторите пароль'
                    },
                    {
                        block: 'input',
                        mods: {
                            theme: 'islands',
                            size: 'm'
                        },
                        name: 'name',
                        placeholder: 'Ф.И.О'
                    },
                    {
                        block: 'select',
                        mods: {
                            mode: 'radio',
                            theme: 'islands',
                            size: 'm'
                        },
                        name: 'select2',
                        val: 2,
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
                    },
                    {
                        block: 'button',
                        mods: {
                            theme: 'islands',
                            size: 'm',
                            type: 'submit',
                            login: true
                        },
                        text: 'Создать пользователя'
                    }
                ]
            }
        ];
    })
)
