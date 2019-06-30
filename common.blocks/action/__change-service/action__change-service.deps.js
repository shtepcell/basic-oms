({
    tech: 'js',
    shouldDeps: [
        {
            block: 'order',
            elem: 'service-info',
            mods: {
                type: ['internet', 'l3vpn', 'l2vpn', 'vpls', 'iptv']
            },
            tech: 'bemhtml'
        },
        {
            block: 'order',
            elem: 'service-info'
        },
        {
            block: 'gavno',
            elem: 'vkusnoe'
        }
    ],
    mustDeps: [
        {
            block: 'field',
            elem: 'idoss'
        }
    ]
})
