block('order').elem('service-info').elemMod('type', 'safe').content()(function () {
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
                    elem: 'body-row-name',
                    content: 'Ёмкость'
                },
                {
                    elem: 'body-row-data',
                    content: order.info.volume || ''
                }
            ]
        },
        {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Использовать черный список по умолчанию?'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.useDefaultBlackList
                }
            ]
        },
        {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Список нежелательного контента'
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
                        url: `/storage/${order.info.blackListFile}`,
                        content: order.info.blackListFile
                    }
                }
            ]
        }
    ]
})


block('order').elem('service-info').elemMod('type', 'safe').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    if(!order)
        order = {
            info: {}
        }

    let previewBlackList;
    let titleBlackList = 'Список нежелательного контента';
    
    if (order.info.blackListFile) {
        previewBlackList = {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: titleBlackList
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
                        url: `/storage/${order.info.blackListFile}`,
                        content: order.info.blackListFile
                    }
                }
            ]
        };
        titleBlackList = 'Загрузить новый список'
    }

    return [
        {
            elem: 'body-row',
            content: [
                {
                    elem: 'body-row-name',
                    content: 'Ёмкость'
                },
                {
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'select',
                            elem: 'volume',
                            val: order.info.volume || null
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
                    content: 'Использовать черный список по умолчанию?'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'select',
                            name: 'useDefaultBlackList',
                            mods: {
                                mode: 'radio',
                                theme: 'islands',
                                size: 'l'
                            },
                            val: order.info.useDefaultBlackList,
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
        previewBlackList,
        {
            block: 'order',
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: titleBlackList
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block : 'attach',
                            name: 'blackListFile',
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
