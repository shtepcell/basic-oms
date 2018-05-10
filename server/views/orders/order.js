module.exports = function(opt, data) {

    return {
        view: 'page-index',
        title: `Заказ #${data.order.id}`,
        meta: {
            description: `Заказ #${data.order.id}`,
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
                adminEdit: opt.admin,
                user: data.__user,
                dataset: data.dataset,
                department: data.department
            },
            {
                block: 'chat',
                order: data.order
            }
        ]
    };
};
