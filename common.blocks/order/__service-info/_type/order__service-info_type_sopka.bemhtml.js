block('order').elem('service-info').elemMod('type', 'sopka').content()(function () {
    let { order } = this.ctx;

    if (!order) {
        order = {
            info: {}
        }
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
        }
    ]
})

block('order').elem('service-info').elemMod('type', 'sopka').elemMod('access', true).content()(function () {
    let { order } = this.ctx;

    if (!order) {
        order = {
            info: {}
        }
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
                            val: order.info.volume || ''
                        }
                    ]
                }
            ]
        }
    ]
})
