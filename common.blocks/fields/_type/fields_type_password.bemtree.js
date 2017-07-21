block('fields').mod('type', 'password').content()(function () {
    var passFields = [],
        labelFields = [];

    if(this.ctx.type == 'profile') {

        passFields.push({
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
                name: 'passwordOld',
                placeholder: 'Текущиий пароль'
            }
        });

        labelFields.push({
            block: 'fields',
            elem: 'label',
            content: 'Текущий пароль'
        });

    }

    return [
        {
            block: 'fields',
            elem: 'title',
            content: [
                labelFields,
                {
                    block: 'fields',
                    elem: 'label',
                    content: 'Новый пароль'
                },
                {
                    block: 'fields',
                    elem: 'label',
                    content: 'Повторите пароль'
                }
            ]
        },
        {
            block: 'fields',
            elem: 'body',
            content: [
                passFields,
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
                        placeholder: 'Новый пароль'
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
                }
            ]
        }
    ]

})
