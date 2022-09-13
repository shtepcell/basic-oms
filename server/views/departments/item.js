module.exports = function(opt, data) {
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
                    block: 'department',
                    department: data.department,
                    cities: data.cities
                }
            ]
    }
}
