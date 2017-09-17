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
                content: '17.09.2017 14:56 - Запущен алгоритм прохода заявки через STOP/VSAT.'
            },
            {
                tag: 'div',
                content: '17.09.2017 12:10 - Запущен алгоритм прохода заявки через ГЗП.'
            },
            {
                tag: 'div',
                content: '17.09.2017 9:56 - Отредактированы обязательные поля при иницианации.'
            },
            {
                tag: 'div',
                content: '16.09.2017 19:43 - Исправлены критические ошибки связанные с загрузкой главной страницы.'
            },
            {
                tag: 'div',
                content: '16.09.2017 15:28 - Добавлен раздел "Разработка" для отслеживания изменений системы в процессе разработки.'
            }
        ]
    };
};
