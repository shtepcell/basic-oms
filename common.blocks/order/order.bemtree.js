block('order').content()(function () {
    var tab = this.ctx.tab;

    return [
        {
            elem: 'head',
            order: this.ctx.order
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
                        type: 'link',
                        view: (tab=='info')?'action':null
                    },
                    url: `/order/${this.ctx.order.id}/info`,
                    text: 'Инфо'
                },
                {
                    block: 'button',
                    mods: {
                        theme: 'islands',
                        size: 'l',
                        type: 'link',
                        view: (tab=='gzp')?'action':null
                    },
                    url: `/order/${this.ctx.order.id}/gzp`,
                    text: 'ГЗП'
                },
                {
                    block: 'button',
                    mods: {
                        theme: 'islands',
                        size: 'l',
                        type: 'link',
                        view: (tab=='stop')?'action':null
                    },
                    url: `/order/${this.ctx.order.id}/stop`,
                    text: 'STOP'
                },
                {
                    block: 'button',
                    mods: {
                        theme: 'islands',
                        size: 'l',
                        type: 'link',
                        view: (tab=='history')?'action':null
                    },
                    url: `/order/${this.ctx.order.id}/info`,
                    text: 'Журнал'
                }
            ]
        },
        {
            elem: 'body',
            action: this.ctx.action,
            order: this.ctx.order,
            tab: this.ctx.tab,
            user: this.ctx.user,
            admin: this.ctx.admin,
            dataset: this.ctx.dataset,
            js: true
        }
    ]
})