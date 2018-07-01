block('order').content()(function () {
    var ctx = this.ctx,
        tab = ctx.tab,
        order = ctx.order,
        dataset = ctx.dataset;

    order.flag = dataset.flags[order.id];
    if(tab == 'init') {
        return [
            {
                elem: 'body',
                elemMods: {
                    tab: 'init'
                },
                action: '/init',
                tab: 'init',
                init: true,
                dataset: dataset,
                js: true
            }
        ]
    }

    return [
        {
            elem: 'head',
            order: order,
            tab: tab
        },
        {
            elem: 'body',
            elemMods: {
                tab: ctx.tab
            },
            action: ctx.action,
            order: order,
            tab: ctx.tab,
            user: ctx.user,
            adminEdit: ctx.adminEdit,
            dataset: dataset,
            department: ctx.department,
            js: true
        }
    ]
})
