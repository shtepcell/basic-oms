block('footer').content()(function() {
    return [
        {
            block: 'footer',
            elem: 'company',
            content: [
                {
                    block: 'link',
                    url: 'http://www.miranda-media.ru/',
                    content: {
                        block: 'icon',
                        url: '/logo.png'
                    }
                }
            ]
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
        },
        {
            block: 'footer',
            elem: 'copyright',
            content: 'Copyright (c) 2017 Copyright Holder All Rights Reserved.'
        }
    ];
});

block('footer').wrap()(function () {
    if(this.data.url.pathname != '/login')
        return [
            {
                block: 'footer-control',
                content: this.ctx
            }
        ]
    else return {};
})
