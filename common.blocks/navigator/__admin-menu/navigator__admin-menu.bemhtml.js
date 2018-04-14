block('navigator').elem('admin-menu').elemMod('display', true)(
    replace()(function () {
        return {
            block: 'dropdown',
            mods: {
                switcher: 'link',
                theme: 'islands',
                size: 'l'
            },
            switcher: {
                block: 'link',
                mods: { theme: 'islands', size : 'l' },
                mix: { block: 'navigator', elem: 'link' },
                content: `Администрирование`
            },
            popup: {
                block: 'navigator',
                elem: 'admin-drop'
            }
        }
    })
)
