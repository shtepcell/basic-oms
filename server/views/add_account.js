module.exports = {
    view: 'page-index',
    title: 'Создание пользователя',
    meta: {
        description: 'Страница входа в СУЗ',
        og: {
            url: 'https://suz.miranda-media.ru',
            siteName: 'СУЗ 2.0'
        }
    },
    page: [
        {
            block: 'title',
            content: 'Создание пользователя'
        },
        {
            block: 'form',
            mods: {
                userAdd: true
            }
        }
    ]
};
