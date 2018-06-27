block('switcher').mod('type', 'b2o').mod('display', true).content()(function () {
    var tab = this.ctx.tab;

    return [
        {
            block: 'link',
            mods: { theme: 'islands', size : 'xl', disabled: (tab=='client') },
            url: '/client',
            content: 'Работа с клиентами'
        },
        {
            block: 'link',
            mods: { theme: 'islands', size : 'xl', disabled: (tab=='my') },
            url: '/my',
            content: 'Мои заказы'
        },
        {
            block: 'link',
            mods: { theme: 'islands', size : 'xl', disabled: (tab=='pre') },
            url: '/pre',
            content: 'Проработка'
        },

        {
            block: 'link',
            mods: { theme: 'islands', size : 'xl', disabled: (tab=='build') },
            url: '/build',
            content: 'Реализация'
        }
    ]
})
