module.exports = function(opt, data){
    var orders = data.orders;

    var opt = opt || {},
        pagerId;

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
                block: 'button-panel',
                type: 'b2b'
            },
            {
                block: 'wrap',
                elem: 'main',
                content: [
                    {
                        block: 'title',
                        elem: 'part',
                        content: 'Заявки для проработки отделом B2B'
                    },
                    {
                        block: 'ultra-table',
                        mods: {
                            'static' : true,
                            theme: 'order'
                        },
                        fields: [
                            {
                                name: 'ID',
                                getContent: (order) => `${order.id}`
                            },
                            {
                                name: 'Клиент',
                                getContent: (order) => {
                                    var name = order.info.client.name;
                                    if(name.length >= 60) name = name.substring(0, 57) + '...';

                                    return `[${order.info.client.type.shortName}] ${name}`
                                }
                            },
                            {
                                name: 'Статус',
                                getContent: (order) => `${order.status}`
                            },
                            {
                                name: 'Услуга',
                                getContent: (order) => `${order.info.service.name}`
                            },
                            {
                                name: 'КС',
                                getContent: (order) => `${order.cs}`
                            },
                            {
                                name: 'Адресс',
                                getContent: (order) => `${order.info.city.type} ${order.info.city.name}, ${order.info.street}, ${order.info.adds}`
                            }
                    ],
                    url: '/order/',
                    template: 'id',
                    data: orders
                },
                {
                    block: 'pager',
                    attrs: {
                        id: pagerId
                    }
                }]
            },

        ]
    };
};
