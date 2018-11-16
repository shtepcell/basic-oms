block('footer').content()(function() {
    return [
        {
            block: 'link',
            url: 'http://www.miranda-media.ru/',
            mix: {
                block: 'footer',
                elem: 'company'
            },
            content: {
                block: 'icon',
                url: '/logo.jpg'
            }
        },
        {
            block: 'footer',
            elem: 'support',
            content: [
                {
                    block: 'label',
                    content: 'Сообщить об ошибке :'
                },
                {
                    tag: 'a',
                    attrs: {
                        href: 'mailto:vladislav.telichko@miranda-media.ru'
                    },
                    content: 'vladislav.telichko@miranda-media.ru'
                }
            ]
        }
    ];
});