block('switcher').mod('type', 'gus').mod('display', true).content()(function () {
    var tab = this.ctx.tab;
    
    return [
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
