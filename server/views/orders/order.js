module.exports = function(opt, data) {

    // console.log(data.template);
    var type = {};
    var actions = opt.actions;

    var controls = actions;
    
    switch (opt.tab) {
        case 'info':
            type = {
                title: `Заявка №${data.order.id}`,
                url: `/order/${data.order.id}`,
                action: `/order/${data.order.id}/${opt.tab}`,
                info: 'action'
            };
            break;
        case 'gzp':
            type = {
                title: `Заявка №${data.order.id}`,
                url: `/order/${data.order.id}`,
                action: `/order/${data.order.id}/${opt.tab}`,
                gzp: 'action'
            }
            break;
        case 'stop':
            type = {
                title: `Заявка №${data.order.id}`,
                url: `/order/${data.order.id}`,
                action: `/order/${data.order.id}/${opt.tab}`,
                stop: 'action'
            }
            break;
        default:
            break;
    }

    return {
        view: 'page-index',
        title: type.title,
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
                content: type.title
            },
            {
                block: 'control-group',
                content: [
                    {
                        block: 'button',
                        mods: {
                            theme: 'islands',
                            size: 'l',
                            type: 'link',
                            view: type.info
                        },
                        url: type.url + '/info',
                        text: 'Инфо'
                    },
                    {
                        block: 'button',
                        mods: {
                            theme: 'islands',
                            size: 'l',
                            type: 'link',
                            view: type.gzp
                        },
                        url: type.url + '/gzp',
                        text: 'ГЗП'
                    },
                    {
                        block: 'button',
                        mods: {
                            theme: 'islands',
                            size: 'l',
                            type: 'link',
                            view: type.stop
                        },
                        url: type.url + '/stop',
                        text: 'STOP'
                    }
                ]
            },
            {
                block: 'ultra-form',
                action: type.action,
                method: 'POST',
                text: 'Завершить проработку',
                escapeButton: !opt.access || data.order.gzp.complete,
                mods: {
                    theme: 'order'
                },
                fields: data.template
            },
            controls
        ]
    };
};
