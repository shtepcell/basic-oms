block('chat').elem('editor').content()(function () {
    var users = this.ctx.users;
    var options = [
        {
            text: 'Всем ответсвенным за заказ',
            val: 'all'
        },
        {
            text: 'Иницатору',
            val: 'initiator'
        }
    ];

    for (var i = 0; i < users.length; i++) {
        options.push({
            text: `${users[i].name} [${users[i].department.name}]`,
            val: users[i].login
        })
    }

    return [
        {
            block: 'textarea',
            mix: {
                block: 'chat',
                elem: 'input',
                js: true
            },
            mods: {
                theme: 'islands',
                size: 'l'
            },
            placeholder: 'Введите сообщение...'
        },
        {
            block: 'button',
            mix: {
                block: 'chat',
                elem: 'send',
                js: {
                    anchor: this.ctx.anchor,
                    me: this.ctx.me
                }
            },
            mods: {
                theme: 'islands',
                size: 'l',
                disabled: true
            },
            text: 'Отправить'
        },
        {
            block: 'select',
            mix: {
                block: 'chat',
                elem: 'recipient'
            },
            name: 'recipient',
            mods: {
                mode: 'check',
                theme: 'islands',
                size: 'l'
            },
            text: 'Кому отправить уведомление?',
            options: options
        }
    ]
})
