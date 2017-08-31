module.exports = function(opt){

    return {
        view: 'page-index',
        title: 'Поиск заказов',
        meta: {
            description: 'СУЗ 2.0',
            og: {
                url: 'https://suz.miranda-media.ru',
                siteName: 'СУЗ 2.0'
            }
        },
        page: [
            {
                block: 'title',
                content: 'Поиск заказов'
            },
            {
                block: 'searcher'
            }
        ]
    };
};
