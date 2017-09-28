module.exports = function (opt, data) {
    return {
        view: 'page-index',
        title: 'Статистика',
        meta: {
            description: 'СУЗ 2.0',
            og: {
                url: 'https://suz.miranda-media.ru',
                siteName: 'СУЗ 2.0'
            }
        },
        page: [
            {
                block: 'status',
                statistics: data.statistics,
                deps: data.deps
            }
        ]
    }
};
