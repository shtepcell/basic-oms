block('order').elem('service-info').elemMod('type', 'devices').content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    if(!order)
        order = {
            info: {}
        }

    return [
        {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Количество Unit-мест'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.countOfUtits
                }
            ]
        },
        {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Стойка'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.rack
                }
            ]
        },
        {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Потребляемая мощность'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.powerConsumption
                }
            ]
        },
        {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Требуется монтаж сотрудниками ММ'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.montageNeed
                }
            ]
        },
        {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Требуется ли прокладка соед. линий до других стоек'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.connetionNeed
                }
            ]
        },
        {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Подтверждающий документ ответной стороны'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.confirmDocument
                }
            ]
        }
    ]
})


block('order').elem('service-info').elemMod('type', 'devices').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    if(!order)
        order = {
            info: {}
        }

    return [
        {
            block: 'order',
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Количество Unit-мест'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'input',
                            mods: {
                                theme: 'islands',
                                width: 'available',
                                size: 'l'
                            },
                            val: order.info.countOfUtits || '',
                            name: 'countOfUtits',
                            placeholder: ''
                        }
                    ]
                }
            ]
        },
        {
            block: 'order',
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Стойка'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'select',
                            name: 'rake',
                            mods: {
                                mode: 'radio',
                                theme: 'islands',
                                size: 'l'
                            },
                            val: order.info.rake,
                            options: [
                                {
                                    text: 'ММ',
                                    val: 'ММ'
                                },
                                {
                                    text: 'Клиента',
                                    val: 'Клиента'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            block: 'order',
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Потребляемая мощность'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'input',
                            mods: {
                                theme: 'islands',
                                width: 'available',
                                size: 'l'
                            },
                            val: order.info.powerConsumption || '',
                            name: 'powerConsumption',
                            placeholder: ''
                        }
                    ]
                }
            ]
        },
        {
            block: 'order',
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Требуется монтаж сотрудниками ММ'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'select',
                            name: 'montageNeed',
                            mods: {
                                mode: 'radio',
                                theme: 'islands',
                                size: 'l'
                            },
                            val: order.info.montageNeed,
                            options: [
                                {
                                    text: 'Да',
                                    val: 'Да'
                                },
                                {
                                    text: 'Нет',
                                    val: 'Нет'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            block: 'order',
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Требуется ли прокладка соед. линий до других стоек'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'select',
                            name: 'connetionNeed',
                            mods: {
                                mode: 'radio',
                                theme: 'islands',
                                size: 'l'
                            },
                            val: order.info.connetionNeed,
                            options: [
                                {
                                    text: 'Да',
                                    val: 'Да'
                                },
                                {
                                    text: 'Нет',
                                    val: 'Нет'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            block: 'order',
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Требуется ли прокладка соед. линий до других стоек'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block : 'attach',
                            name: 'confirmDocument',
                            mods : { theme : 'islands', size : 'm', focused : true },
                            button : 'Выберите файл',
                            noFileText : 'Файл не выбран'
                        }
                    ]
                }
            ]
        }
    ]
})
