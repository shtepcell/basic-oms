block('searcher')(
    content()(function () {
        var data = this.ctx.data;

        return [
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
                                    name: 'func',
                                    options: [
                                        {
                                            val: 1,
                                            text: 'Только мои'
                                        },
                                        {
                                            val: 2,
                                            text: 'Просроченные'
                                        },
                                        {
                                            val: 3,
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
                                    mods: {
                                        theme: 'islands',
                                        size: 'l',
                                        type: 'button'
                                    },
                                    name: 'pre',
                                    options: [
                                        {
                                            val: 1,
                                            text: 'ГЗП'
                                        },
                                        {
                                            val: 2,
                                            text: 'STOP/VSAT'
                                        },
                                        {
                                            val: 3,
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
                                    name: 'build',
                                    options: [
                                        {
                                            val: 1,
                                            text: 'ГЗП'
                                        },
                                        {
                                            val: 2,
                                            text: 'Установка оборудования'
                                        },
                                        {
                                            val: 3,
                                            text: 'STOP/VSAT'
                                        },
                                        {
                                            val: 4,
                                            text: 'Настройка сети'
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
                                    options: [
                                        {
                                            val: 1,
                                            text: 'Выполненые по ГЗП'
                                        },
                                        {
                                            val: 2,
                                            text: 'Выполненые по STOP/VSAT'
                                        },
                                        {
                                            val: 3,
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
                                    mods: {
                                        mode: 'radio',
                                        theme: 'islands',
                                        size: 'l',
                                        width: 'available'
                                    },
                                    options: data.services
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
                    {
                        elem: 'row',
                        content: [
                            {
                                elem: 'label',
                                content: 'доп. адресс'
                            },
                            {
                                elem: 'cell',
                                content: {
                                    block: 'input',
                                    name: 'adress',
                                    mods: {
                                        width: 'available',
                                        type: 'text',
                                        theme: 'islands',
                                        size: 'l'
                                    },
                                    placeholder: 'ул. Строителей, д. 7'
                                }
                            }
                        ]
                    }
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
                        url: '/search',
                        content: 'Сбросить фильтры'
                    },
                    {
                        block: 'button',
                        mods: {
                            theme: 'islands',
                            size: 'l'
                        },
                        text: 'Поиск'
                    }
                ]
            }
        ]
    })

)
