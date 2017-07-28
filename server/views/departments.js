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
                mods: {
                    type: 'user'
                },
                type: 'list'
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
                url: '/admin/departments/add',
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
                        field: 'name'
                    },
                    {
                        name: 'Тип отдела',
                        field: 'name'
                    },
                    {
                        name: 'Начальник отдела',
                        field: 'name'
                    },
                    {
                        name: 'Кол-во сотрудников',
                        field: 'name'
                    }
                ],
                data: deps
            }
        ]
    };
};
