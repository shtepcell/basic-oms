block('button-panel').content()(function () {
    var user = this.ctx.user;
    var type = this.ctx.type;

    var content = [];

    switch (user.department.type) {
        case 'b2o':
        case 'b2b':
            return [
                {
                    elem: 'text',
                    content: 'Доступные действия:'
                },
                {
                    block: 'button',
                    mods: {
                        theme: 'islands',
                        size: 'm',
                        type: 'link'
                    },
                    url: '/init',
                    text: 'Инициация заказа'
                }
            ];
    }

    if (type == 'admin') {
        return [
            {
                elem: 'text',
                content: 'Доступные действия:'
            },
            {
                block: 'button',
                mods: {
                    theme: 'islands',
                    size: 'm',
                    type: 'link'
                },
                url: '/admin/users/add',
                icon: {
                    block: 'icon',
                    url: '/add.svg',
                    mix: 'button__icon'
                },
                text: 'Создать пользователя'
            }
        ]
    }

    return content;
})
