block('short-search').content()(function () {
    return [
        {
            elem: 'form',
            action: this.ctx.url,
            js: true,
            content: [
                {
                    elem: 'label',
                    content: 'Поиск по справочнику:'
                },
                {
                    block: 'input',
                    mods: {
                        theme: 'islands',
                        size: 'm',
                        type: 'text'
                    },
                    val: this.ctx.query.name,
                    name: 'name',
                },
                {
                    block: 'button',
                    mods: {
                        theme: 'islands',
                        size: 'm',
                        type: 'submit'
                    },
                    text: 'Поиск'
                }
            ]
        }
    ]
})
