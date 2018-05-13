module.exports = function(opt, data){
    var orders = data.orders;

    var opt = opt || {},
        pagerId;

    var users = data.users;
    if (opt.pagers && opt.pagers.length)
        pagerId = opt.pagers[0];

    return {
        view: 'page-index',
        title: 'Главная страница',
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
                mods: {
                    lvl: 3
                },
                content: 'Главная страница'
            },
            {
                block: 'button-panel',
                user: data.__user
            },
            {
                block: 'wrap',
                elem: 'main',
                content: [
                    {
                        block: 'short-filter',
                        dataset: data.dataset,
                        query: data.params
                    },
                    {
                        block: 'title',
                        mods: {
                            lvl: 4
                        },
                        content: `Список заказов: `
                    },
                    {
                        block: 'table',
                        mods: {
                            type: 'order',
                            width: 'available'
                        },
                        params: data.params,
                        data: orders
                    },
                    {
                        block: 'pager',
                        attrs: {
                            id: pagerId
                        }
                    }
                ]
            }
        ]
    };
};
