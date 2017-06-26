module.exports = {
    view: 'page-index',
    title: 'Пользователи СУЗ',
    meta: {
        description: 'СУЗ 2.0',
        og: {
            url: 'https://suz.miranda-media.ru',
            siteName: 'СУЗ 2.0'
        }
    },
    page: [
        {
            block: 'form',
            mods: {
                userAdd: true
            }
        },
        {
            block: 'table',
            mods: {
                users: true
            }
        }
    ]
};
