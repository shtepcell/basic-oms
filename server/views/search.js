module.exports = function(opt, data){
    var orders = data.orders || [];

    var opt = opt || {},
        pagerId;
    if (opt.pagers && opt.pagers.length)
        pagerId = opt.pagers[0];

    return {
        view: 'page-index',
        title: 'Поиск заказов',
        meta: {
            description: 'СУЗ 2.0',
            og: {
                url: process.env.PROJECT_HOST,
                siteName: 'СУЗ 2.0'
            }
        },
        page: [
            {
                block: 'searcher',
                data: data.data,
                query: data.query,
                dataset: data.dataset
            },
            {
                block: 'wrapper',
                mods: {
                    size: 'l'
                },
                content: [
                        {
                            block: 'searcher',
                            elem: 'title',
                            content: `Найдено ${data.pagers.first.records} заказов: `
                        },
                        {
                            block: 'button',
                            mods: {
                                theme: 'islands',
                                disabled: false,
                                size: 'm'
                            },
                            mix:[
                                {
                                    block: 'action',
                                    elem: 'export',
                                    js: {
                                        query: data.query
                                    }
                                },
                                {
                                    block: 'searcher',
                                    elem: 'export'
                                }
                            ],
                            text: 'Экспорт в Excel'
                        },
                        {
                            block: 'button',
                            mods: {
                                theme: 'islands',
                                disabled: false,
                                size: 'm'
                            },
                            mix:[
                                {
                                    block: 'action',
                                    elem: 'export',
                                    js: {
                                        query: data.query,
                                        type: 'report'
                                    }
                                },
                                {
                                    block: 'searcher',
                                    elem: 'export'
                                }
                            ],
                            text: 'Отчет по срокам организации'
                        },
                        {
                            block: 'orders-table',
                            params: data.query,
                            flags: data.dataset.flags,
                            services: data.dataset.services,
                            orders: orders
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
