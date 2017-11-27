module.exports = function(opt, data){

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
            {
                block: 'title',
                mods: {
                    lvl: 3
                },
                content: 'Последние события'
            },
            {
                block: 'table',
                mods: {
                    type: 'notify',
                    width: 'available'
                },
                data: data.notifies
            }
        ]
    };
};
