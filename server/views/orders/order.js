module.exports = function(opt, data) {
    return {
        view: 'page-index',
        title: `Заказ #${data.order.id}`,
        meta: {
            description: `Заказ #${data.order.id}`,
            og: {
                url: process.env.PROJECT_HOST,
                siteName: 'СУЗ 2.0'
            }
        },
        page: [
            {
                block: 'wrap',
                elem: 'order',
                content: [
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
                        me: data.__user.name,
                        users: data.users,
                        order: data.order
                    }
                ]
            }

        ]
    };
};
