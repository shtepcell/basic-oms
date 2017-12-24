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
                url: 'https://suz.miranda-media.ru',
                siteName: 'СУЗ 2.0'
            }
        },
        page: [
            {
                block: 'searcher',
                data: data.data,
                query: data.query
            },
            {
                block: 'searcher',
                elem: 'wrap',
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
                        text: 'Экспорт в CSV'
                    },
                    {
                        block: 'table',
                        mods: {
                            type: 'order',
                            width: 'available'
                        },
                        params: data.query,
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
