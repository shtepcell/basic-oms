block('department').elem('cities').content()(function () {

    return [
        {
            elem: 'inline-form',
            js: true,
            url: this.ctx.url,
            content: [
                {
                    elem: 'inline-form-label',
                    content: 'Введите название города :'
                },
                {
                    block : 'suggest',
                    mods : {
                        theme : 'islands',
                        size : 'm',
                        'has-dataprovider' : 'adress'
                    },
                    name: 'city',
                    dataprovider : {
                        data : this.ctx.cities
                    }
                },
                {
                    block: 'button',
                    mods: {
                        theme: 'islands',
                        size: 'm',
                        type: 'submit'
                    },
                    text: 'Добавить город'
                }
            ]
        },
        {
            elem: 'cities-table',
            content: {
                block: 'ultra-table',
                elem: 'cities',
                fields: [
                    {
                        name: 'Название города',
                        getContent: (item) => `${item.type} ${item.name}`
                    }
                ],
                data: this.ctx.own
            }
        }
    ]
})
