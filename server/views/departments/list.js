module.exports = function(opt, data) {
    var opt = opt || {};

    var deps = data.departments;

    return {
        view: 'page-index',
        title: 'Подразделения СУЗ',
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
                elem: 'part',
                content: 'Список отделов'
            },
            {
                block: 'button',
                mods: {
                    theme: 'islands',
                    size: 'm',
                    type: 'link'
                },
                mix: {
                    block: 'button',
                    elem: 'add'
                },
                url: '/admin/departments/create',
                icon: {
                    block: 'icon',
                    url: '/add.svg',
                    mix: 'button__icon'
                },
                text: 'Создать отдел'
            },
            {
                block: 'ultra-table',
                mods: {
                    'static' : true,
                    theme: 'common'
                },
                fields: [
                    {
                        name: 'Название отдела',
                        getContent: (item) => `${item.name}`
                    },
                    {
                        name: 'Тип отдела',
                        getContent: (item) => `${item.type}`
                    },
                    {
                        name: 'Кол-во сотрудников',
                        getContent: (item) => `Не доступно`
                    }
                ],
                url: '/admin/departments/',
                template: '_id',
                data: deps
            }
        ]
    };
};
