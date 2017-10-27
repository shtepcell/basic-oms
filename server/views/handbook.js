module.exports = function(opt, data) {
    var opt = opt || {},
        pagerId;

    var query = data.query || {};

    if (opt.pagers && opt.pagers.length)
        pagerId = opt.pagers[0];

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
                block: 'short-search',
                url: opt.reqUrl+'/search',
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
