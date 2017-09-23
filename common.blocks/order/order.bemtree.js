block('order').content()(function () {
    return [
        {
            elem: 'head',
            order: this.ctx.order,
            tab: this.ctx.tab
        },
        {
            block: 'control-group',
            mix: {
                block: 'order',
                elem: 'tab'
            },
            content: [
                {
                    block: 'button',
                    mods: {
                        theme: 'islands',
                        size: 'l',
                        type: 'link'
                    },
                    // url: type.url + '/info',
                    text: 'Инфо'
                },
                {
                    block: 'button',
                    mods: {
                        theme: 'islands',
                        size: 'l',
                        type: 'link'
                    },
                    // url: type.url + '/gzp',
                    text: 'ГЗП'
                },
                {
                    block: 'button',
                    mods: {
                        theme: 'islands',
                        size: 'l',
                        type: 'link'
                    },
                    // url: type.url + '/stop',
                    text: 'STOP'
                },
                {
                    block: 'button',
                    mods: {
                        theme: 'islands',
                        size: 'l',
                        type: 'link'
                    },
                    // url: type.url + '/stop',
                    text: 'Журнал'
                }
            ]
        },
        {
            elem: 'body',
            order: this.ctx.order,
            tab: this.ctx.tab
        }
    ]
})
