module.exports = function(opt, data){

    return {
        view: 'page-index',
        title: 'Главная страница',
        meta: {
            description: 'СУЗ 2.0',
            og: {
                url: process.env.PROJECT_HOST,
                siteName: 'СУЗ 2.0'
            }
        },
        page: [
            {
                block: 'wrapper',
                mods: {
                    size: 'm'
                },
                content: [
                    {
                        block: 'title',
                        mods: {
                            lvl: 3
                        },
                        content: 'Уведомления'
                    },
                    {
                        block: 'notifies',
                        notifies: data.notifies
                    }
                ]
            }

        ]
    };
};
