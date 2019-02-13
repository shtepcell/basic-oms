block('order').elem('service-info').elemMod('type', 'e1').content()(function () {
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
                    content: 'Количество поток E1'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.e1Stream
                }
            ]
        },
        {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Необходимый протокол сигнализации'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.alertType
                }
            ]
        },
        {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Количество соединительных линий'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.countOfConnectionLine
                }
            ]
        },
        {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Поддержка режима CRC-4'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.crc4Support
                }
            ]
        },
        {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Network Part'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.networkPart
                }
            ]
        }
    ]
})


block('order').elem('service-info').elemMod('type', 'e1').elemMod('access', true).content()(function () {
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
                    content: 'Количество поток E1'
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
                            val: order.info.e1Stream || '',
                            name: 'e1Stream',
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
                    content: 'Необходимый протокол сигнализации'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'select',
                            name: 'alertType',
                            mods: {
                                mode: 'radio',
                                theme: 'islands',
                                size: 'l'
                            },
                            val: order.info.alertType,
                            options: [
                                {
                                    text: 'DSS-1',
                                    val: 'DSS-1'
                                },
                                {
                                    text: 'ОКС-7',
                                    val: 'ОКС-7'
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
                    content: 'Количество соединительных линий'
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
                            val: order.info.countOfConnectionLine || '',
                            name: 'countOfConnectionLine',
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
                    content: 'Поддержка режима CRC-4',
                    attrs: {
                        "data-title": "При активном режиме CRC-4 - кадры произвольным образом группируются по 16 (мультикадрам CRC-4). Мультикадр CRC-4 всегда начинается с кадра, содержащего синхросигнал (FAS)"
                    }
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'select',
                            name: 'crc4Support',
                            mods: {
                                mode: 'radio',
                                theme: 'islands',
                                size: 'l'
                            },
                            val: order.info.crc4Support,
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
                    content: 'Network Part'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'select',
                            name: 'networkPart',
                            mods: {
                                mode: 'radio',
                                theme: 'islands',
                                size: 'l'
                            },
                            val: order.info.networkPart,
                            options: [
                                {
                                    text: 'User',
                                    val: 'User'
                                },
                                {
                                    text: 'Network',
                                    val: 'Network'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
})
