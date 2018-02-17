block('order').elem('capability').elemMod('type', 'no').content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    if(!order) {
        order = {
            gzp: {
                capability: false
            }
        }
    }
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
                    content: order.gzp.reason
                }
            ]
        }
    ]
})

block('order').elem('capability').elemMod('type', 'no').elemMod('access', true).content()(function () {

    var ctx = this.ctx,
        order = ctx.order;

    if(!order) {
        order = {
            gzp: {
                capability: false
            }
        }
    }

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
                        val: order.gzp.reason,
                        placeholder: 'Укажите причину'
                    }
                }
            ]
        }
    ]
})
