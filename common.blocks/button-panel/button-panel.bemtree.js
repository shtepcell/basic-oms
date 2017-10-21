block('button-panel').content()(function () {
    var type = this.ctx.type;
    var content = [];
    switch (type) {
        case 'b2b':
            content = [
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
                    text: 'Инициация заявки'
                }
            ];
            break;
        case 'users':
            content = [
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
            break;
        default:
            content = [];
            break;
    }
    return content;
})
