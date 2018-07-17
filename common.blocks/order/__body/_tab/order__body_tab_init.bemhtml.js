block('order').elem('body').elemMod('tab', 'init').content()(function () {

    var ctx = this.ctx,
        tab = ctx.tab,
        dataset = ctx.dataset;

    return [
            {
                elem: 'body-row',
                content: [
                    {
                        elem: 'body-row-name',
                        content: 'Клиент *'
                    },
                    {
                        elem: 'body-row-data',
                        content: [
                            {
                                block : 'suggest',
                                mods : {
                                    theme : 'islands',
                                    size : 'l',
                                    'has-dataprovider' : 'adress'
                                },
                                placeholder: 'ООО "Газпром"',
                                name: 'client',
                                dataprovider: {
                                    data: dataset['clients']
                                }
                            }
                        ]
                    }
                ]
            },
            {
                elem: 'body-row',
                content: [
                    {
                        elem: 'body-row-name',
                        content: 'Контактные данные клиента *'
                    },
                    {
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'input',
                                name: 'contact',
                                mods: {
                                    width: 'available',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                autocomplete: false,
                                placeholder: 'Номер телефона и другая информация'
                            }
                        ]
                    }
                ]
            },
            {
                elem: 'body-row',
                content: [
                    {
                        elem: 'body-row-name',
                        content: 'Номер CMS'
                    },
                    {
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'input',
                                name: 'cms',
                                mods: {
                                    width: 'available',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                autocomplete: false,
                                placeholder: '12-345678-90'
                            }
                        ]
                    }
                ]
            },
            {
                elem: 'separator'
            },
            {
                elem: 'body-row',
                content: [
                    {
                        elem: 'body-row-name',
                        content: 'Город *'
                    },
                    {
                        elem: 'body-row-data',
                        content: [
                            {
                                block : 'suggest',
                                mods : {
                                    theme : 'islands',
                                    size : 'l',
                                    'has-dataprovider' : 'adress'
                                },
                                placeholder: 'г. Москва',
                                name: 'city',
                                dataprovider: {
                                    data: dataset['cities']
                                }
                            }
                        ]
                    }
                ]
            },
            {
                block: 'field',
                elem: 'type-adress',
                display: true,
                dataset: dataset,
                elemMods: {
                    access: true
                }
            },
            {
                block: 'order',
                elem: 'adress-info',
                elemMods: {
                    type: 'location',
                    access: true
                },
                dataset: dataset
            },
            {
                elem: 'separator'
            },
            {
                elem: 'body-row',
                content: [
                    {
                        elem: 'body-row-name',
                        content: 'Услуга *'
                    },
                    {
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
                                        text: 'РРЛ',
                                        val: 'rrl'
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
            {
                block: 'order',
                elem: 'service-info'
            },
            {
                elem: 'separator'
            },
            {
                elem: 'body-row',
                content: [
                    {
                        elem: 'body-row-name',
                        content: 'Дополнительная информация'
                    },
                    {
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'input',
                                name: 'add_info',
                                mods: {
                                    width: 'available',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                autocomplete: false,
                                placeholder: 'Доп. информация по заказу'
                            }
                        ]
                    }
                ]
            },
            {
                elem: 'body-row',
                content: [
                    {
                        elem: 'body-row-name',
                        content: 'Прикреплённый файл'
                    },
                    {
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'attach',
                                name: 'file-init',
                                mods: {
                                    theme: 'islands',
                                    size: 'l'
                                },
                                button: 'Выберите файл',
                                noFileText: 'Файл не выбран'
                            }
                        ]
                    }
                ]
            },
            { elem: 'separator' },
            {
                elem: 'body-row',
                mix: { block: 'gavno', elem: 'vkusnoe' },
                content: [
                    {
                        elem: 'body-row-name',
                        content: 'Отправить на проработку *'
                    },
                    {
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'select',
                                name: 'pre',
                                mods: {
                                    mode: 'radio',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                options: [
                                    {
                                        text: 'только ГЗП',
                                        val: 'gzp-pre'
                                    },
                                    {
                                        text: 'только СТОП',
                                        val: 'stop-pre'
                                    },
                                    {
                                        text: 'ГЗП и СТОП',
                                        val: 'all-pre'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                block: 'order',
                elem: 'control',
                content: [
                    {
                        block: 'button',
                        mods: {
                            theme: 'islands',
                            size: 'l',
                            type: 'submit'
                        },
                        text: 'Инициировать заказ'
                    }
                ]
            }
        ];
})
