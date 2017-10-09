module.exports = function (opt, data) {
    return {
        view: 'page-index',
        title: 'Выходные дни',
        meta: {
            description: 'Страница выходных дней',
            og: {
                url: 'https://suz.miranda-media.ru',
                siteName: 'СУЗ 2.0'
            }
        },
        page: [
            {
                block: 'ultra-form',
                action: '/admin/holiday/',
                method: 'POST',
                text: 'Добавить',
                fields: [
                    {
                        name: 'date',
                        desc: 'Выберите день',
                        mods: {
                            type: 'date'
                        }
                    }
                ]
            },
            {
                block: 'ultra-form',
                action: '/admin/holiday/delete',
                method: 'POST',
                text: 'Удалить',
                fields: [
                    {
                        name: 'date',
                        desc: 'Выберите день',
                        mods: {
                            type: 'date'
                        }
                    }
                ]
            }
        ]
    }
}
