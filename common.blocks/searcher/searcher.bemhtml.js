block('searcher')(
    content()(function () {
        var data = this.ctx.data,
            query = this.ctx.query;

        return [
            {
                elem: 'form',
                js: true,
                content: [
                    {
                        elem: 'group',
                        content: [
                            {
                                elem: 'row',
                                content: [
                                    {
                                        elem: 'label',
                                        content: 'ID заказа'
                                    },
                                    {
                                        elem: 'cell',
                                        content: {
                                            block: 'input',
                                            name: 'id',
                                            val: query.id,
                                            mods: {
                                                width: 'available',
                                                type: 'text',
                                                theme: 'islands',
                                                size: 'l'
                                            },
                                            placeholder: '1234'
                                        }
                                    }
                                ]
                            },
                            {
                                elem: 'row',
                                content: [
                                    {
                                        elem: 'label',
                                        content: 'Номер CMS'
                                    },
                                    {
                                        elem: 'cell',
                                        content: {
                                            block: 'input',
                                            name: 'cms',
                                            val: query.cms,
                                            mods: {
                                                width: 'available',
                                                type: 'text',
                                                theme: 'islands',
                                                size: 'l'
                                            },
                                            placeholder: '12-345678-9'
                                        }
                                    }
                                ]
                            },
                            {
                                elem: 'row',
                                content: [
                                    {
                                        elem: 'label',
                                        content: 'Дополнительные фильтры'
                                    },
                                    {
                                        elem: 'cell',
                                        content: {
                                            block: 'checkbox-group',
                                            mods: {
                                                theme: 'islands',
                                                size: 'l',
                                                type: 'button'
                                            },
                                            val: query.func || [],
                                            name: 'func',
                                            options: [
                                                {
                                                    val: '1',
                                                    text: 'Только мои'
                                                },
                                                {
                                                    val: '2',
                                                    text: 'Просроченные'
                                                },
                                                {
                                                    val: '3',
                                                    text: 'На паузе'
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        elem: 'group',
                        content: [
                            {
                                elem: 'row',
                                content: [
                                    {
                                        elem: 'label',
                                        content: 'Проработка'
                                    },
                                    {
                                        elem: 'cell',
                                        content: {
                                            block: 'checkbox-group',
                                            val: query.pre || [],
                                            mods: {
                                                theme: 'islands',
                                                size: 'l',
                                                type: 'button'
                                            },
                                            name: 'pre',
                                            options: [
                                                {
                                                    val: '1',
                                                    text: 'ГЗП'
                                                },
                                                {
                                                    val: '2',
                                                    text: 'СТОП/VSAT'
                                                },
                                                {
                                                    val: '3',
                                                    text: 'Согласование с клиентом'
                                                }
                                            ]
                                        }
                                    }
                                ]
                            },
                            {
                                elem: 'row',
                                content: [
                                    {
                                        elem: 'label',
                                        content: 'Построение'
                                    },
                                    {
                                        elem: 'cell',
                                        content: {
                                            block: 'checkbox-group',
                                            mods: {
                                                theme: 'islands',
                                                size: 'l',
                                                type: 'button'
                                            },
                                            val: query.build || [],
                                            name: 'build',
                                            options: [
                                                {
                                                    val: '1',
                                                    text: 'ГЗП'
                                                },
                                                {
                                                    val: '2',
                                                    text: 'Установка оборудования'
                                                },
                                                {
                                                    val: '3',
                                                    text: 'СТОП/VSAT'
                                                },
                                                {
                                                    val: '4',
                                                    text: 'Настройка сети'
                                                },
                                                {
                                                    val: '5',
                                                    text: 'Уведомление клиента'
                                                }
                                            ]
                                        }
                                    }
                                ]
                            },
                            {
                                elem: 'row',
                                content: [
                                    {
                                        elem: 'label',
                                        content: 'Завершение'
                                    },
                                    {
                                        elem: 'cell',
                                        content: {
                                            block: 'checkbox-group',
                                            mods: {
                                                theme: 'islands',
                                                size: 'l',
                                                type: 'button'
                                            },
                                            name: 'final',
                                            val: query.final || [],
                                            options: [
                                                {
                                                    val: '1',
                                                    text: 'Выполненые по ГЗП'
                                                },
                                                {
                                                    val: '2',
                                                    text: 'Выполненые по СТОП/VSAT'
                                                },
                                                {
                                                    val: '3',
                                                    text: 'Отклонённые'
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        elem: 'group',
                        title: 'Фильтр по основным полям',
                        content: [
                            {
                                elem: 'row',
                                content: [
                                    {
                                        elem: 'label',
                                        content: 'Клиент'
                                    },
                                    {
                                        elem: 'cell',
                                        content: {
                                            block : 'suggest',
                                            name: 'client',
                                            val: query.client,
                                            mods : {
                                                theme : 'islands',
                                                size : 'l',
                                                'has-dataprovider' : 'adress'
                                            },
                                            placeholder: '[РП] РНКБ',
                                            dataprovider: {
                                                data: data.clients
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                elem: 'row',
                                content: [
                                    {
                                        elem: 'label',
                                        content: 'Услуга'
                                    },
                                    {
                                        elem: 'cell',
                                        content: {
                                            block: 'select',
                                            name: 'service',
                                            val: query.service,
                                            mods: {
                                                mode: 'radio',
                                                theme: 'islands',
                                                size: 'l',
                                                width: 'available'
                                            },
                                            options: [
                                                {
                                                    text: 'Не выбрано'
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
                                    }
                                ]
                            },
                            {
                                elem: 'row',
                                content: [
                                    {
                                        elem: 'label',
                                        content: 'Город'
                                    },
                                    {
                                        elem: 'cell',
                                        content: {
                                            block : 'suggest',
                                            name: 'city',
                                            val: query.city,
                                            mods : {
                                                width: 'available',
                                                theme : 'islands',
                                                size : 'l',
                                                'has-dataprovider' : 'adress'
                                            },
                                            placeholder: 'г. Симферополь',
                                            dataprovider: {
                                                data: data.cities
                                            }
                                        }
                                    }
                                ]
                            },
                            // {
                            //     elem: 'row',
                            //     content: [
                            //         {
                            //             elem: 'label',
                            //             content: 'доп. адресс'
                            //         },
                            //         {
                            //             elem: 'cell',
                            //             content: {
                            //                 block: 'input',
                            //                 name: 'adress',
                            //                 mods: {
                            //                     width: 'available',
                            //                     type: 'text',
                            //                     theme: 'islands',
                            //                     size: 'l'
                            //                 },
                            //                 placeholder: 'ул. Строителей, д. 7'
                            //             }
                            //         }
                            //     ]
                            // }
                        ]
                    },
                    {
                        elem: 'actions',
                        content: [
                            {
                                block: 'link',
                                mods: {
                                    theme: 'islands',
                                    size: 'm'
                                },
                                url: '/search?clear',
                                content: 'Сбросить фильтры'
                            },
                            {
                                block: 'button',
                                mods: {
                                    type: 'submit',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                text: 'Поиск'
                            }
                        ]
                    }
                ]
            }
        ]
    })

)
