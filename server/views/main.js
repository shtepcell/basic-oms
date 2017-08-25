module.exports = function(opt){

    return {
        view: 'page-index',
        title: 'Главная страница',
        meta: {
            description: 'СУЗ 2.0',
            og: {
                url: 'https://suz.miranda-media.ru',
                siteName: 'СУЗ 2.0'
            }
        },
        page: [
            'Main page',
            {
                block: 'button-panel',
                content: [
                    {
                        block: 'button',
                        mods: {
                            theme: 'islands',
                            size: 'm',
                            type: 'link'
                        },
                        url: '/init',
                        text: 'Инициация заявки'
                    }
                ]
            }
        ]
    };
};
