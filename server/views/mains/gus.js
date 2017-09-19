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
                block: 'wrap',
                elem: 'main',
                content: [
                    {
                        block: 'title',
                        elem: 'part',
                        content: 'Заявки для проработки отделом GUS'
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
                                getContent: (order) => `[${order.info.client.type.shortName}] ${order.info.client.name}`
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
                    }
                ]
            }
        ]
    };
};
