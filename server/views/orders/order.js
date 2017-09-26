module.exports = function(opt, data) {

    return {
        view: 'page-index',
        title: 'Заявка',
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
                action: `/order/${data.order.id}/${opt.tab}`,
                order: data.order,
                tab: opt.tab,
                admin: false,
                user: data.__user,
                dataset: data.dataset
            }
        ]
    };
};
