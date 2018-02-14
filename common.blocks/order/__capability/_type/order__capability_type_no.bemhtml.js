block('order').elem('capability').elemMod('type', 'no').content()(function () {
    return [
        {
            block: 'order',
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Причина технической невозможности'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: this.ctx.order.gzp.reason
                }
            ]
        }
    ]
})

block('order').elem('capability').elemMod('type', 'no').elemMod('access', true).content()(function () {
    return [
        {
            block: 'order',
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Причина технической невозможности'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: {
                        block: 'input',
                        mods: {
                            theme: 'islands',
                            size: 'l',
                            width: 'available'
                        },
                        name: 'reason',
                        val: this.ctx.order.gzp.reason,
                        placeholder: 'Укажите причину'
                    }
                }
            ]
        }
    ]
})
