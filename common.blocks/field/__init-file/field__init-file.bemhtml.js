block('field').elem('init-file').content()(function () {
    var order = this.ctx.order;

    if(this.ctx.display)
    return [
        {
            block: 'order',
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Прикрепленные файлы'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'link',
                            mods: {
                                theme: 'islands',
                                size: 'l'
                            },
                            url: `/order/${order.id}/file/${order.info['file-init']}`,
                            content: order.info['file-init']
                        }
                    ]
                }
            ]
        }
    ]
})


block('field').elem('init-file').elemMod('access', true).content()(function () {
    if(this.ctx.display)
    return [
        {
            elem: 'body-row',
            content: [
                {
                    elem: 'body-row-name',
                    content: 'Прикрепленные файлы'
                },
                {
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'attach',
                            name: 'order',
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
        }
    ]
})
