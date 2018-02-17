block('field').elem('service').content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

    var services = {
        internet: 'Интернет',
         vpls: 'VPLS',
         l3vpn: 'L3VPN',
         l2vpn: 'L2VPN',
         cloud: 'Облачная АТС',
         digital: 'Цифровые каналы',
         sks: 'СКС',
         sputnik: 'Спутник',
         devices: 'Размещение оборудования',
         phone: 'Телефония (IP-телефония)',
         analog: 'Аналоговые каналы (ТЧ)',
         vibe: 'Волокно',
         wifi: 'Авторизация Wi-Fi',
         iptv: 'IP TV'
    };

    if(ctx.display) {
        return [
            {
                block: 'order',
                elem: 'body-row',
                content: [
                    {
                        block: 'order',
                        elem: 'body-row-name',
                        content: 'Услуга'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: services[order.info.service]
                    }
                ]
            }
        ]
    }
})

block('field').elem('service').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order,
        dataset = ctx.dataset;

    if(ctx.display) {
        return [

            {
                block: 'order',
                elem: 'body-row',
                content: [
                    {
                        block: 'order',
                        elem: 'body-row-name',
                        content: 'Услуга *'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'select',
                                name: 'service',
                                mix: {
                                    block: 'action',
                                    elem: 'change-service',
                                    js: true
                                },
                                mods: {
                                    mode: 'radio',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                val: order.info.service,
                                options: [
                                    {
                                        text: ''
                                    },
                                    {
                                        text: 'Интернет',
                                        val: 'internet'
                                    },
                                    {
                                        text: 'L3VPN',
                                        val: 'l3vpn'
                                    },
                                    {
                                        text: 'L2VPN',
                                        val: 'l2vpn'
                                    },
                                    {
                                        text: 'Облачная АТС',
                                        val: 'cloud'
                                    },
                                    {
                                        text: 'Цифровые каналы',
                                        val: 'digital'
                                    },
                                    {
                                        text: 'Спутник',
                                        val: 'sputnik'
                                    },
                                    {
                                        text: 'Размещение оборудования',
                                        val: 'devices'
                                    },
                                    {
                                        text: 'Телефония (IP-телефония)',
                                        val: 'phone'
                                    },
                                    {
                                        text: 'СКС',
                                        val: 'sks'
                                    },
                                    {
                                        text: 'Аналоговые каналы (ТЧ)',
                                        val: 'analog'
                                    },
                                    {
                                        text: 'Волокно',
                                        val: 'vibe'
                                    },
                                    {
                                        text: 'VPLS',
                                        val: 'vpls'
                                    },
                                    {
                                        text: 'Авторизация Wi-Fi',
                                        val: 'wifi'
                                    },
                                    {
                                        text: 'IP TV',
                                        val: 'iptv'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
        ]
    }
})
