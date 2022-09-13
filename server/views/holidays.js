module.exports = function (opt, data) {
    return {
        view: 'page-index',
        title: 'Выходные дни',
        meta: {
            description: 'Страница выходных дней',
            og: {
                url: process.env.PROJECT_HOST,
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
            },
            {
                block: 'ultra-table',
                elem: 'holidays',
                fields: [
                    {
                        name: 'Дата',
                        getContent: (item) => {
                            var year = item.date.getFullYear();
                            var month = item.date.getMonth() + 1;
                            if(month < 10) {
                                month = '0' + month;
                            }
                            var day = item.date.getDate();
                            if(day < 10) {
                                day = '0' + day;
                            }
                            return `${day}-${month}-${year}`;
                        }
                    }
                ],
                data: data.holidays
            }
        ]
    }
}
