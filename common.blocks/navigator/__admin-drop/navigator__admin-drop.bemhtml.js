block('navigator').elem('admin-drop').content()(function () {
    return [
        {
            block: 'link',
            mods: { theme: 'islands', size : 'l' },
            mix: { block: 'navigator', elem: 'admin-link' },
            url: '/v2/admin/users',
            content: 'Учетные записи'
        },
        {
            block: 'link',
            mods: { theme: 'islands', size : 'l' },
            mix: { block: 'navigator', elem: 'admin-link' },
            url: '/admin/departments',
            content: 'Отделы'
        },
        {
            block: 'link',
            mods: { theme: 'islands', size : 'l' },
            mix: { block: 'navigator', elem: 'admin-link' },
            url: '/v2/cities',
            content: 'Города'
        },
        {
            block: 'link',
            mods: { theme: 'islands', size : 'l' },
            mix: { block: 'navigator', elem: 'admin-link' },
            url: '/admin/street',
            content: 'Улицы'
        },
        {
            block: 'link',
            mods: { theme: 'islands', size : 'l' },
            mix: { block: 'navigator', elem: 'admin-link' },
            url: '/admin/clients',
            content: 'Клиенты'
        },
        {
            block: 'link',
            mods: { theme: 'islands', size : 'l' },
            mix: { block: 'navigator', elem: 'admin-link' },
            url: '/admin/client-types',
            content: 'Типы клиентов'
        },
        {
            block: 'link',
            mods: { theme: 'islands', size : 'l' },
            mix: { block: 'navigator', elem: 'admin-link' },
            url: '/admin/providers',
            content: 'Провайдеры'
        },
        {
            block: 'link',
            mods: { theme: 'islands', size : 'l' },
            mix: { block: 'navigator', elem: 'admin-link' },
            url: '/admin/holiday',
            content: 'Выходные'
        },
        {
            block: 'link',
            mods: { theme: 'islands', size : 'l' },
            mix: { block: 'navigator', elem: 'admin-link' },
            url: '/admin/configuration',
            content: 'Настройки'
        }
    ]
})
