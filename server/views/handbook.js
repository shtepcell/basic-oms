module.exports = function(opt, data) {
    var opt = opt || {},
        pagerId;

    var query = data.query || {};

    if (opt.pagers && opt.pagers.length)
        {pagerId = opt.pagers[0];}

    const handbookTitle = {
        cities: 'Города',
        clients: 'Клиенты',
        'client-types': 'Типы клиентов',
        providers: 'Провайдеры',
        street: 'Города'
    }[opt.handbookType] || 'Справочник';

    return {
        view: 'page-index',
        title: opt.title || 'Справочник',
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
                mods: { lvl: '3' },
                content: handbookTitle
            },
            {
                block: 'short-search',
                url: opt.reqUrl + '/search',
                query: query
            },
            {
                block: 'inline-form',
                attrs: {
                    method: opt.reqUrl
                },
                mods: {
                    type: opt.handbookType
                }
            },
            {
                block: 'handbook-table',
                js: true,
                mods: {
                    type: opt.handbookType
                }
            },
            {
                block: 'pager',
                attrs: {
                    id: pagerId
                }
            }
        ]
    };
};
