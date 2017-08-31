block('searcher')(
    content()([
        {
            elem: 'row',
            content: [
                {
                    elem: 'cell',
                    content: {
                        elem: 'label',
                        content: 'ID заказа'
                    }
                },
                {
                    elem: 'cell',
                    content: {
                        block: 'input',
                        name: 'id',
                        mods: {
                            type: 'text',
                            theme: 'islands',
                            size: 'm'
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
                    elem: 'cell',
                    content: {
                        elem: 'label',
                        content: 'Номер CMS'
                    }
                },
                {
                    elem: 'cell',
                    content: {
                        block: 'input',
                        name: 'cms',
                        mods: {
                            type: 'text',
                            theme: 'islands',
                            size: 'm'
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
                    elem: 'cell',
                    content: {
                        block: 'checkbox-group',
                        mods: {
                            theme: 'islands',
                            size: 'm',
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
        },
        {
            elem: 'row',
            content: [
                {
                    elem: 'cell',
                    content: {
                        elem: 'label',
                        content: 'Проработка'
                    }
                },
                {
                    elem: 'cell',
                    content: {
                        block: 'checkbox-group',
                        mods: {
                            theme: 'islands',
                            size: 'm',
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
                    elem: 'cell',
                    content: {
                        elem: 'label',
                        content: 'Построение'
                    }
                },
                {
                    elem: 'cell',
                    content: {
                        block: 'checkbox-group',
                        mods: {
                            theme: 'islands',
                            size: 'm',
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
                    elem: 'cell',
                    content: {
                        elem: 'label',
                        content: 'Завершение'
                    }
                },
                {
                    elem: 'cell',
                    content: {
                        block: 'checkbox-group',
                        mods: {
                            theme: 'islands',
                            size: 'm',
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
        },
        {
            elem: 'row',
            content: [
                {
                    elem: 'cell',
                    content: {
                        elem: 'label',
                        content: 'Клиент'
                    }
                },
                {
                    elem: 'cell',
                    content: {
                        block: 'input',
                        name: 'client',
                        mods: {
                            type: 'text',
                            theme: 'islands',
                            size: 'm'
                        },
                        placeholder: '[РП] РНКБ'
                    }
                }
            ]
        },
        {
            elem: 'row',
            content: [
                {
                    elem: 'cell',
                    content: {
                        elem: 'label',
                        content: 'Услуга'
                    }
                },
                {
                    elem: 'cell',
                    content: {
                        block: 'input',
                        name: 'service',
                        mods: {
                            type: 'text',
                            theme: 'islands',
                            size: 'm'
                        },
                        placeholder: 'Интернет'
                    }
                }
            ]
        },
        {
            elem: 'row',
            content: [
                {
                    elem: 'cell',
                    content: {
                        elem: 'label',
                        content: 'Инициатор'
                    }
                },
                {
                    elem: 'cell',
                    content: {
                        block: 'input',
                        name: 'init',
                        mods: {
                            type: 'text',
                            theme: 'islands',
                            size: 'm'
                        },
                        placeholder: 'Петрова Василиса Ивановна'
                    }
                }
            ]
        },
        {
            elem: 'row',
            content: [
                {
                    elem: 'cell',
                    content: {
                        elem: 'label',
                        content: 'Город'
                    }
                },
                {
                    elem: 'cell',
                    content: {
                        block: 'input',
                        name: 'city',
                        mods: {
                            type: 'text',
                            theme: 'islands',
                            size: 'm'
                        },
                        placeholder: 'г. Симферополь'
                    }
                }
            ]
        },
        {
            elem: 'row',
            content: [
                {
                    elem: 'cell',
                    content: {
                        elem: 'label',
                        content: 'доп. адресс'
                    }
                },
                {
                    elem: 'cell',
                    content: {
                        block: 'input',
                        name: 'adress',
                        mods: {
                            type: 'text',
                            theme: 'islands',
                            size: 'm'
                        },
                        placeholder: 'ул. Строителей, д. 7'
                    }
                }
            ]
        }

    ])
)
