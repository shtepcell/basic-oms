block('form').mod('type', 'password').content()(function () {

    return [

        {
            block: 'fields',
            mods: {
                type: 'password'
            },
            type: this.ctx.type
        },
        {
            block: 'button',
            mods: {
                theme: 'islands',
                size: 'm',
                type: 'submit'
            },
            mix: {
                block: 'button',
                elem: 'create'
            },
            text: 'Изменить пароль'
        }
    ];

})
