module.exports = function (opt, data) {

    return {
        view: 'page-index',
        title: 'Создание отдела',
        meta: {
            description: 'Страница создания отдела',
            og: {
                url: process.env.PROJECT_HOST,
                siteName: 'СУЗ 2.0'
            }
        },
        page: [
            {
                block: 'title',
                mods: {
                    lvl: '3'
                },
                content: 'Создание отдела'
            },
            {
                block: 'ultra-form',
                action: '/admin/departments/create',
                method: 'POST',
                text: 'Создать отдел',
                fields: [
                    {
                        name: 'name',
                        desc: 'Название отдела',
                        mods: {
                            type: 'text',
                            maxLenght: 40
                        }
                    },
                    {
                        name: 'type',
                        desc: 'Тип отдела',
                        mods: {
                            type: 'select'
                        },
                        data: [
                            {
                                text: 'B2B',
                                val: 'b2b'
                            },
                            {
                                text: 'B2O',
                                val: 'b2o'
                            },
                            {
                                text: 'ГУС/ТЦТЭT',
                                val: 'gus'
                            },
                            {
                                text: 'Группа СКС, Wi-Fi',
                                val: 'sks'
                            },
                            {
                                text: 'Группа РРЛ',
                                val: 'rrl'
                            },
                            {
                                text: 'Технический отдел',
                                val: 'admin'
                            },
                            {
                                text: 'Сетевой отдел',
                                val: 'net'
                            },
                            {
                                text: 'Руководство',
                                val: 'man'
                            }
                        ]
                    }
                ]
            }
        ]
    }
};
