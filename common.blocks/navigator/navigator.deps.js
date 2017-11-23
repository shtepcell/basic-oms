({
    shouldDeps: [
        {
            block: 'navigator',
            elems: ['link', 'dropdown', 'title']
        },
        {
            block: 'link',
            mods: {
                theme: 'islands',
                nav: true,
                end: true
            }
        },
        {
            block: 'dropdown',
            mods: {
                switcher: 'link',
                theme: 'islands',
                nav: true,
                size: 'm',
            }
        }
    ]
})
