module.exports = function(opt, data) {

    // console.log(data.template);

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
                elem: 'main',
                content: 'Инициация заказа'
            },
            {
                block: 'ultra-form',
                action: '/init',
                method: 'POST',
                text: 'Иницировать заявку',
                mods: {
                    theme: 'order'
                },
                fields: data.template
            }
        ]
    }
};
