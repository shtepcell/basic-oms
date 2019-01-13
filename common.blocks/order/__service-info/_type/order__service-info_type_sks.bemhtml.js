block('order').elem('service-info').elemMod('type', 'sks').content()(function () {
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
                    content: 'Количество рабочих мест/портов'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.countOfPorts
                }
            ]
        },
        {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Поэтажная схема помещений с указанием зон для монтажа оборудования и прокладки СКС'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: {
                        block: 'link',
                        mods: {
                            theme: 'islands',
                            size: 'l'
                        },
                        attrs: {
                            target: "_blank"
                        },
                        url: `/storage/${order.info.schema}`,
                        content: order.info.schema
                    }
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
                    content: {
                        block: 'link',
                        mods: {
                            theme: 'islands',
                            size: 'l'
                        },
                        attrs: {
                            target: "_blank"
                        },
                        url: `/storage/${order.info.objectPhoto}`,
                        content: order.info.objectPhoto
                    }
                }
            ]
        }
    ]
})


block('order').elem('service-info').elemMod('type', 'sks').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    if(!order)
        order = {
            info: {}
        }

    
    let previewSchema;
    let titleSchema = 'Поэтажная схема помещений с указанием зон для монтажа оборудования и прокладки СКС';
    
    if (order.info.schema) {
        previewSchema = {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: titleSchema
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: {
                        block: 'link',
                        mods: {
                            theme: 'islands',
                            size: 'l'
                        },
                        attrs: {
                            target: "_blank"
                        },
                        url: `/storage/${order.info.schema}`,
                        content: order.info.schema
                    }
                }
            ]
        };
        titleSchema = 'Загрузить новую схему'
    }
    
    let previewPhoto;
    let titlePhoto = 'Фото объекта';
    
    if (order.info.objectPhoto) {
        previewPhoto = {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: titlePhoto
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: {
                        block: 'link',
                        mods: {
                            theme: 'islands',
                            size: 'l'
                        },
                        attrs: {
                            target: "_blank"
                        },
                        url: `/storage/${order.info.objectPhoto}`,
                        content: order.info.objectPhoto
                    }
                }
            ]
        };
        titlePhoto = 'Загрузить новое фото'
    }

    return [
        previewSchema,
        previewPhoto,
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
                    content: 'Количество рабочих мест/портов'
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
                            val: order.info.countOfPorts || '',
                            name: 'countOfPorts',
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
                    content: titleSchema
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
                    content: titlePhoto
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
