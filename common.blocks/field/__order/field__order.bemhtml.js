block('field').elem('order').content()(function () {
    var order = this.ctx.order,
        fileName = order.info.order;


    if(this.ctx.display) {

        return [
            {
                block: 'order',
                elem: 'body-row',
                content: [
                    {
                        block: 'order',
                        elem: 'body-row-name',
                        content: 'Договор'
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
                                url: `/storage/${fileName}`,
                                content: order.info.order
                            }
                        ]
                    }
                ]
            }
        ]
    }
})


block('field').elem('order').elemMod('access', true).content()(function () {
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
                        content: 'Договор'
                    },
                    {
                        block: 'order',
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
                                noFileText: order.info.order || 'Файл не выбран'
                            }
                        ]
                    }
                ]
            }
        ]
})
