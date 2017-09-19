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
                content: '19.09.2017 12:58 - Подсчет и отображение контрольных сроков в таблицаx заявок.'
            },
            {
                tag: 'div',
                content: '18.09.2017 22:29 - Автодополнение городов с учетом их типа.'
            },
            {
                tag: 'div',
                content: '18.09.2017 15:01 - Удаление "вредных" символов перед сохранением данных в БД'
            },
            {
                tag: 'div',
                content: '18.09.2017 12:13 - Логгирование действий с заявками'
            },
            {
                tag: 'div',
                content: '18.09.2017 8:46 - Увеличил ограничения по количеству символов в справочниках'
            },
            {
                tag: 'div',
                content: '18.09.2017 8:14 - Названия этапов на русском'
            },
            {
                tag: 'div',
                content: '17.09.2017 23:46 - Исправлены критические ошибки'
            },
            {
                tag: 'div',
                content: '17.09.2017 22:25 - Частичный перенос справочников из СУЗ 1.0'
            },
            {
                tag: 'div',
                content: '17.09.2017 19:54 - Скорректирован запрос в БД для главных страниц в зависимости от отдела текущего пользователя'
            },
            {
                tag: 'div',
                content: '17.09.2017 19:21 - Автодополнения поля "Провайдер". Инициация отделом B2B'
            },
            {
                tag: 'div',
                content: '17.09.2017 17:49 - Исправлен бесконечный redirect при сбросе coockie-файлов'
            },
            {
                tag: 'div',
                content: '17.09.2017 16:32 - Исправлено удаление городов из отделов. Логирование веб-сервера'
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
