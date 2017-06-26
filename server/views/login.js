module.exports = {
    view: 'page-index',
    title: 'Авторизация',
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
            mods: {
                login: true
            }
        },
        {
            block: 'form',
            mods: {
                login: true
            }
        }
    ]
};
