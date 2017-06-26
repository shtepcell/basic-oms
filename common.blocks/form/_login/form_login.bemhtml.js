block('form').mod('login')(
    attrs()({
        method: 'POST',
        action: '/login'
    }),
    content()(function () {
        return [
            {
                block: 'fields',
                mods: {
                    login: true
                },
                content: [
                    {
                        block: 'input',
                        mods: {
                            theme: 'islands',
                            size: 'xl'
                        },
                        name: 'login',
                        placeholder: 'Логин'
                    },
                    {
                        tag: 'br'
                    },
                    {
                        block: 'input',
                        mods: {
                            theme: 'islands',
                            size: 'xl',
                            type: 'password'
                        },
                        name: 'password',
                        placeholder: 'Пароль'
                    }
                ]
            },
            {
                block: 'button',
                mods: {
                    theme: 'islands',
                    size: 'xl',
                    type: 'submit',
                    login: true
                },
                text: 'Войти'
            }
        ];
    })
)
