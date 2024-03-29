block('footer').content()(function() {
    const company = this.data.locals.company;

    return [
        {
            block: 'link',
            mix: {
                block: 'footer',
                elem: 'company'
            },
            content: {
                block: 'icon',
                url: company === 'm' ? '/logo-m.jpg' : '/logo-t.png'
            }
        },
        company === 'm' && {
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