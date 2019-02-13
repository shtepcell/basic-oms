block('searcher')(
    content()(function () {
        const ctx = this.ctx;
        const data = ctx.data;
        const query = ctx.query;
        const { services } = ctx.dataset;

        data.deps = data.deps.map(item => {
            return {
                text: item.name,
                val: item._id + ''
            }
        });

        const srvs = Object.keys(services).map( (item) => {
            return {
                val: item,
                text: services[item]
            };
        });

        srvs.unshift({text: 'Не выбрано'});


        const types = ctx.dataset.types.map( item => {
            return {
                text: item,
                val: item
            }
        });

        types.unshift({text: 'Не выбрано'});

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
                                            autocomplete: false,
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
                                            autocomplete: false,
                                            mods: {
                                                width: 'available',
                                                type: 'cms',
                                                theme: 'islands',
                                                size: 'l'
                                            },
                                            placeholder: '__-______-_'
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
                                                },
                                                {
                                                    val: '4',
                                                    text: 'Наличие CMS'
                                                },
                                                {
                                                    val: '5',
                                                    text: 'Архивные'
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
                                                    val: '4',
                                                    text: 'СКС'
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
                                                    val: '6',
                                                    text: 'СКС'
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
                            },
                            {
                                elem: 'row',
                                content: [
                                    {
                                        elem: 'label',
                                        content: ''
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
                                            val: query.shutdown || [],
                                            name: 'shutdown',
                                            options: [
                                                {
                                                    val: '1',
                                                    text: 'Отключение'
                                                },
                                                {
                                                    val: '2',
                                                    text: 'Демонтаж'
                                                },
                                                {
                                                    val: '3',
                                                    text: 'Отключён'
                                                },
                                                {
                                                    val: '6',
                                                    text: 'Приостановка. СТОП'
                                                },
                                                {
                                                    val: '4',
                                                    text: 'Приостановка'
                                                },
                                                {
                                                    val: '5',
                                                    text: 'Сервис приостановлен'
                                                },
                                                
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
                                        content: 'Менеджер'
                                    },
                                    {
                                        elem: 'cell',
                                        content: {
                                            block: 'select',
                                            name: 'manager',
                                            val: query.manager,
                                            text: 'Не выбран',
                                            mods: {
                                                mode: 'check',
                                                theme: 'islands',
                                                size: 'l',
                                                width: 'available'
                                            },
                                            options: data.managers
                                        }
                                    }
                                ]
                            },
                            {
                                elem: 'row',
                                content: [
                                    {
                                        elem: 'label',
                                        content: 'Ответственный отдел'
                                    },
                                    {
                                        elem: 'cell',
                                        content: {
                                            block: 'select',
                                            name: 'resp',
                                            val: query.resp + '',
                                            text: 'Не выбран',
                                            mods: {
                                                disabled: true,
                                                mode: 'radio-check',
                                                theme: 'islands',
                                                size: 'l',
                                                width: 'available'
                                            },
                                            options: data.deps
                                        }
                                    }
                                ]
                            },
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
                                            block: 'suggest',
                                            name: 'client',
                                            val: query.client,
                                            mods: {
                                                theme: 'islands',
                                                size: 'l',
                                                'has-dataprovider': 'adress'
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
                                        content: 'Тип клиента'
                                    },
                                    {
                                        elem: 'cell',
                                        content: {
                                            block: 'select',
                                            name: 'clientType',
                                            val: query.clientType,
                                            mods: {
                                                mode: 'radio',
                                                theme: 'islands',
                                                size: 'l'
                                            },
                                            options: types
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
                                            options: srvs
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
                                            block: 'suggest',
                                            name: 'city',
                                            val: query.city,
                                            mods: {
                                                width: 'available',
                                                theme: 'islands',
                                                size: 'l',
                                                'has-dataprovider': 'adress'
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
                                        content: 'Улица'
                                    },
                                    {
                                        elem: 'cell',
                                        content: {
                                            block: 'suggest',
                                            name: 'street',
                                            val: query.street,
                                            mods: {
                                                width: 'available',
                                                theme: 'islands',
                                                size: 'l',
                                                'has-dataprovider': 'adress'
                                            },
                                            placeholder: 'ул. Строителей',
                                            dataprovider: {
                                                data: data.streets
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        elem: 'group',
                        title: 'Фильтр по дате',
                        content: [
                            {
                                elem: 'row',
                                content: [

                                    {
                                        elem: 'label',
                                        content: 'Дата'
                                    },
                                    {
                                        elem: 'cell',
                                        content: {
                                            block: 'control-group',
                                            content: [
                                                {
                                                    block: 'select',
                                                    mix: {
                                                        block: 'searcher',
                                                        elem: 'date'
                                                    },
                                                    name: 'date-status',
                                                    val: query['date-status'],
                                                    mods: {
                                                        mode: 'radio-check',
                                                        theme: 'islands',
                                                        size: 'l'
                                                    },
                                                    text: 'Выберите этап',
                                                    options: [
                                                        {
                                                            text: 'Инициация',
                                                            val: 'init'
                                                        },
                                                        {
                                                            text: 'Проработка ГЗП',
                                                            val: 'gzp-pre'
                                                        },
                                                        {
                                                            text: 'Проработка СКС',
                                                            val: 'sks-pre'
                                                        },
                                                        {
                                                            text: 'Проработка СТОП',
                                                            val: 'stop-pre'
                                                        },
                                                        {
                                                            text: 'Организация ГЗП',
                                                            val: 'gzp-build'
                                                        },
                                                        {
                                                            text: 'Организация СКС',
                                                            val: 'sks-build'
                                                        },
                                                        {
                                                            text: 'Организация СТОП',
                                                            val: 'stop-build'
                                                        },
                                                        {
                                                            text: 'Включен',
                                                            val: 'succes'
                                                        },
                                                        {
                                                            text: 'Отчёт',
                                                            val: 'report'
                                                        }
                                                    ]
                                                },
                                                {
                                                    block: 'input',
                                                    mods: {
                                                        'has-calendar': true,
                                                        size: 'l',
                                                        theme: 'islands'
                                                    },
                                                    mix: {
                                                        block: 'searcher',
                                                        elem: 'date'
                                                    },
                                                    val: query['date-start'],
                                                    placeholder: 'От',
                                                    name: 'date-start',
                                                    weekdays: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
                                                    months: ['Январь', 'Февраль', 'Март',
                                                        'Апрель', 'Май', 'Июнь',
                                                        'Июль', 'Август', 'Сентябрь',
                                                        'Октябрь', 'Ноябрь', 'Декабрь']
                                                },
                                                {
                                                    block: 'input',
                                                    mods: {
                                                        'has-calendar': true,
                                                        size: 'l',
                                                        theme: 'islands'
                                                    },
                                                    mix: {
                                                        block: 'searcher',
                                                        elem: 'date'
                                                    },
                                                    placeholder: 'До',
                                                    val: query['date-end'],
                                                    name: 'date-end',
                                                    weekdays: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
                                                    months: ['Январь', 'Февраль', 'Март',
                                                        'Апрель', 'Май', 'Июнь',
                                                        'Июль', 'Август', 'Сентябрь',
                                                        'Октябрь', 'Ноябрь', 'Декабрь']
                                                }
                                            ]
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
