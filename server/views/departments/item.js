module.exports = function(opt, data) {

    var dep = data.department;
    var ownCity = dep.cities || [];
    var cities = data.cities.map( item => {
        if( !item.usage )
            return `${item.type} ${item.name}`;
    });

    var citiesTable = [
        {
            block: 'title',
            elem: 'part',
            content: 'Привязанные города'
        },
        {
            block: 'ultra-form',
            action: '/admin/departments/'+dep._id+'/city',
            method: 'POST',
            text: 'Добавить',
            fields: [
                {
                    name: 'city',
                    desc: 'Название города',
                    mods: {
                        type: 'suggest',
                        'has-dataprovider' : 'adress'
                    },
                    dataprovider : {
                        data : cities
                    }
                }
            ]
        },
        {
            block: 'ultra-table',
            elem: 'cities',
            fields: [
                {
                    name: 'Название города',
                    getContent: (item) => `${item.type} ${item.name}`
                }
            ],
            data: ownCity
    }];

    if(dep.type != 'gus') citiesTable = [];

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
            },
            citiesTable
        ]
    }
};
