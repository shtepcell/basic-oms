module.exports = function (opt, data) {
    return {
        view: 'page-index',
        title: 'Статистика',
        meta: {
            description: 'СУЗ 2.0',
            og: {
                url: process.env.PROJECT_HOST,
                siteName: 'СУЗ 2.0'
            }
        },
        page: [
            {
                block: 'status',
                statistics: data.statistics,
                deps: data.deps,
            },
            {
                block: 'status-description',
                ts: data.ts,
                duration: data.duration
            }
        ]
    }
};
