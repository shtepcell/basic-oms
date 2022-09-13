module.exports = function (opt, data) {
    return {
        view: 'page-index',
        title: 'Ошибка',
        meta: {
            description: 'Ошибка',
            og: {
                url: process.env.PROJECT_HOST,
                siteName: 'СУЗ'
            }
        },
        page: [
            {
                block: 'page',
                mod: 'view',
                val: '403'
            }
        ]
    };
};
