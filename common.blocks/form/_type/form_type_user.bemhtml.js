block('form').mod('type', 'user')(
    attrs()({
        method: 'POST',
        action: '/admin/users/add'
    }),
    content()(function () {
        return [
            {
                block: 'fields',
                mods: {
                    type: 'user'
                }
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
                text: 'Создать'
            }
        ];
    })
)
