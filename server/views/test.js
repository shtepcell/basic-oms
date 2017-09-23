module.exports = function(opt, data) {

    return {
        view: 'page-index',
        title: 'type.title',
        meta: {
            description: 'Страница создания отдела',
            og: {
                url: 'https://suz.miranda-media.ru',
                siteName: 'СУЗ 2.0'
            }
        },
        page: [
            {
                block: 'order',
                order: data.order,
                tab: opt.tab
            }
        ]
    };
};
