block('order').elem('body').elemMod('tab', 'init').content()(function () {
    const { dataset, order, user } = this.ctx;

    const { services, types } = dataset;

    const srvs = Object.keys(services).map(item => {
        return {
            val: item,
            text: services[item]
        };
    }).filter(item => item.val != 'rrl');

    const typesOption = types.map(item => {
        return {
            text: item,
            val: item
        }
    });

    srvs.unshift({ text: '' });

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
                            block: 'suggest',
                            mods: {
                                theme: 'islands',
                                size: 'l',
                                'has-dataprovider': 'adress'
                            },
                            placeholder: 'ООО "Газпром"',
                            name: 'client',
                            dataprovider: {
                                data: dataset['clients']
                            },
                            val: order.client
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
                    content: 'Тип клиента'
                },
                {
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'select',
                            name: 'clientType',
                            mods: {
                                mode: 'radio',
                                theme: 'islands',
                                size: 'l'
                            },
                            options: typesOption
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
                            placeholder: 'Номер телефона и другая информация',
                            val: order.contact
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
                                type: 'cms',
                                size: 'l'
                            },
                            val: order.cms,
                            autocomplete: false,
                            placeholder: '__-______-_'
                        }
                    ]
                }
            ]
        },
        {
            block: 'field',
            elem: 'date-request',
            elemMods: {
                access: true
            },
            order: { info: order },
            display: true
        },
        user.department.type === 'special' && {
            elem: 'body-row',
            content: [
                {
                    elem: 'body-row-name',
                    content: 'Ограниченный доступ'
                },
                {
                    elem: 'body-row-data',
                    content: {
                        block: 'checkbox',
                        name: 'private',
                        mods: {
                            theme: 'islands',
                            size: 'l',
                            checked: true,
                            disabled: true,
                        },
                        val: true
                    }
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
                            block: 'suggest',
                            mods: {
                                theme: 'islands',
                                size: 'l',
                                'has-dataprovider': 'adress'
                            },
                            placeholder: 'г. Москва',
                            name: 'city',
                            dataprovider: {
                                data: dataset['cities']
                            },
                            val: order.city
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
            order: { info: order },
            elemMods: {
                access: true
            }
        },
        {
            block: 'order',
            elem: 'adress-info',
            elemMods: {
                type: (order.coordinate) ? 'coordination' : 'location',
                access: true
            },
            order: { info: order },
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
                            val: order.service,
                            options: srvs
                        }
                    ]
                }
            ]
        },
        {
            block: 'order',
            elem: 'service-info',
            elemMods: {
                type: order.service,
                access: true
            },
            order: { info: order }
        },
        {
            block: 'field',
            elem: 'idoss',
            order: { info: order },
            elemMods: {
                access: true
            },
            display: true
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
                            val: order.add_info,
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
            mix: { block: 'gavno', elem: 'vkusnoe', elemMods: { visible: order.service != 'sks' } },
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
                    text: 'Создать заказ'
                }
            ]
        }
    ];
})
