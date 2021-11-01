module.exports = function (opt, data, ctx) {
    const { settings } = ctx || {};

    return {
        view: 'page-admin',
        title: 'Настройки СУЗ',
        meta: {
            description: 'Настройки СУЗ',
            og: {
                url: 'https://suz.miranda-media.ru',
                siteName: 'СУЗ 2.0'
            }
        },
        page: [
            {
                block: 'admin-settings',
                settings,
                js: true,
            }
        ]
    };
};
