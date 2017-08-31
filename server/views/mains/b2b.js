module.exports = function(opt, data){
    var orders = data.orders;

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
                            field: 'id'
                        },
                        {
                            name: 'Клиент',
                            field: ['info', 'client', 'name']
                        },
                        {
                            name: 'Город',
                            field: ['info', 'city', 'name']
                        },
                        {
                            name: 'Этап',
                            field: 'status'
                        },
                        {
                            name: 'Услуга',
                            field: ['info', 'service', 'name']
                        }
                    ],
                    url: '/orders/',
                    template: 'id',
                    data: orders
                }]
            }
        ]
    };
};
