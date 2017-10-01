block('form').elem('login')(
    tag()('form'),
    attrs()(function () {
        return {
            method: 'POST',
            action: this.ctx.url || '/login'
        }
    }),
    content()(function () {
        return [
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
            },
            {
                block: 'button',
                mods: {
                    theme: 'islands',
                    size: 'xl',
                    type: 'submit'
                },
                mix: {
                    block: 'button',
                    elem: 'login'
                },
                text: 'Войти'
            }
        ];
    })
)
