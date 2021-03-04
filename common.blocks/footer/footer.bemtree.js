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
                    content: 'Ошибка? Нужна помощь? :'
                },
                {
                    tag: 'a',
                    attrs: {
                        target: '__blank',
                        href: 'https://t.me/joinchat/ZgFTaQAUnRwzZDE6'
                    },
                    content: [
                        {
                            block: 'icon',
                            mix: { block: 'footer', elem: 'telegram' },
                            url: '/telegram.svg'
                        },
                        'СУЗ - support'
                    ]
                }
            ]
        }
    ];
});