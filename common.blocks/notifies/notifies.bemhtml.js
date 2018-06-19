block('notifies').content()(function () {
    var notifies = this.ctx.notifies;
    var ret = []

    if(notifies.length > 0)
        notifies.forEach( item => {
            ret.push({
                elem: 'item',
                elemMods: {
                    unread: item.isNew
                },
                js: {
                    id: item._id
                },
                content: [
                    {
                        elem: 'icon',
                        content: '™'
                    },
                    {
                        elem: 'text',
                        content: `Заказ #${item.order} • ${item.text}`
                    },
                    {
                        elem: 'time',
                        content: '21:34'
                    }
                ]
            })
        })

    return [
        {
            elem: 'header',
            content: [
                {
                    block: 'checkbox',
                    mods: {
                        theme: 'islands',
                        size: 'l',
                        disabled: true,
                        checked: true
                    },
                    name: 'name1',
                    val: 'val_1',
                    text: 'События'
                },
                {
                    block: 'checkbox',
                    mods: {
                        theme: 'islands',
                        size: 'l',
                        disabled: true,
                        checked: true
                    },
                    name: 'name1',
                    val: 'val_1',
                    text: 'Сообщения'
                },
                {
                    block: 'checkbox',
                    mods: {
                        theme: 'islands',
                        size: 'l',
                        disabled: true,
                        checked: true
                    },
                    name: 'name1',
                    val: 'val_1',
                    text: 'Оповещения системы'
                }
            ]
        },
        {
            elem: 'body',
            content: ret
        }
    ]
})
