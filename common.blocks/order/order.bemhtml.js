block('order').content()(function () {
    const { tab, order, dataset, user, action, adminEdit, department } = this.ctx;

    if (tab == 'init') {
        return [
            {
                elem: 'body',
                elemMods: {
                    tab: 'init'
                },
                action: '/init',
                tab: 'init',
                init: true,
                order,
                dataset,
                user,
                js: true
            }
        ]
    }
    order.flag = dataset.flags[order.id];

    return [
        {
            elem: 'head',
            order: order,
            user: user,
            tab: tab,
            dataset: dataset
        },
        {
            elem: 'body',
            elemMods: {
                tab: tab
            },
            action,
            order,
            tab,
            user,
            adminEdit,
            dataset,
            department,
            js: true
        }
    ]
})
