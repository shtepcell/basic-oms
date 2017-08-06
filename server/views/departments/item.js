module.exports = function(opt, data) {

    var dep = data.department;

    return {
        view: 'page-index',
        title: 'Создание отдела',
        meta: {
            description: 'Страница создания отдела',
            og: {
                url: 'https://suz.miranda-media.ru',
                siteName: 'СУЗ 2.0'
            }
        },
        page: [
            {
                block: 'title',
                text: 'Редкатирование отдела'
            },
            {
                block: 'ultra-form',
                action: '/admin/departments/'+dep._id,
                method: 'POST',
                text: 'Сохранить',
                fields: [
                    {
                        name: 'name',
                        desc: 'Название отдела',
                        mods: {
                            type: 'text',
                            maxLenght: 40
                        },
                        val: dep.name,
                        required: true
                    },
                    {
                        name: 'type',
                        desc: 'Тип отдела',
                        mods: {
                            type: 'select'
                        },
                        val: dep.type,
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
