block('form').mod('type', 'user').content()(function () {
    var text = {
        create: 'Создать',
        edit: 'Сохранить',
        profile: 'Сохранить'
    };
    return [
            {
                block: 'fields',
                mods: {
                    type: 'user'
                },
                type: this.ctx.type,
                data: this.data.locals.user
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
                text: text[this.ctx.type]
            }
        ];
})
