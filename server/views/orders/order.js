module.exports = function(opt, data) {

    return {
        view: 'page-index',
        title: `Заявка #${data.order.id}`,
        meta: {
            description: `Заявка #${data.order.id}`,
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
                admin: opt.admin,
                user: data.__user,
                dataset: data.dataset
            }
        ]
    };
};
