module.exports = function(opt, data){

    return {
        view: 'page-index',
        title: 'Разработка',
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
                elem: 'main',
                content: 'Список изменений СУЗ'
            },
            {
                tag: 'div',
                content: '16.09.2017 15:28 - Добавлен раздел "Разработка" для отслеживания изменений системы в процессе разработки.'
            }
        ]
    };
};
