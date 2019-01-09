block('order').elem('service-info').elemMod('type', 'vibe').content()(function () {
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
                    content: 'Схема объекта  с указанием зон для прокладки/строительтва ВОК'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.schema
                }
            ]
        },
        {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Способ прокладки'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.layingMethod
                }
            ]
        },
        {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Фото объекта'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.objectPhoto
                }
            ]
        }
    ]
})


block('order').elem('service-info').elemMod('type', 'vibe').elemMod('access', true).content()(function () {
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
                    content: 'Схема объекта  с указанием зон для прокладки/строительтва ВОК'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block : 'attach',
                            name: 'schema',
                            mods : { theme : 'islands', size : 'm', focused : true },
                            button : 'Выберите файл',
                            noFileText : 'Файл не выбран'
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
                    content: 'Способ прокладки'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'select',
                            name: 'layingMethod',
                            mods: {
                                mode: 'radio',
                                theme: 'islands',
                                size: 'l'
                            },
                            val: order.info.layingMethod,
                            options: [
                                {
                                    text: 'Кабель-канал',
                                    val: 'Кабель-канал'
                                },
                                {
                                    text: 'Штробление стен',
                                    val: 'Штробление стен'
                                },
                                {
                                    text: 'Открытый способ',
                                    val: 'Открытый способ'
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
                    content: 'Фото объекта'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block : 'attach',
                            name: 'objectPhoto',
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
