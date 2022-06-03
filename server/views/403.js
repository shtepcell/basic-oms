module.exports = function (opt, data) {

    return {
        view: 'page-index',
        title: 'Ошибка',
        meta: {
            description: 'Ошибка',
            og: {
                url: 'https://suz.miranda-media.ru',
                siteName: 'СУЗ 2.0'
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
