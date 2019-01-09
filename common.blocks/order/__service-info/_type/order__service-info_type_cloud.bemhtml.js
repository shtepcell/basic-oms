block('order').elem('service-info').elemMod('type', 'cloud').content()(function () {
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
                    content: 'Количество линий'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.countOfLines
                }
            ]
        },
        {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Количество внутренних номеров'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.countOfNumbers
                }
            ]
        },
        {
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Количество внешних номеров'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: order.info.countOfOutNumbers
                }
            ]
        }
    ]
})


block('order').elem('service-info').elemMod('type', 'cloud').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    const numbers = [];

    for (let index = 1; index <= 32; index++) {
        numbers.push({
            text: `${index}`,
            val: `${index}`
        }) 
    }

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
                    content: 'Количество линий'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'select',
                            name: 'countOfLines',
                            mods: {
                                mode: 'radio',
                                theme: 'islands',
                                size: 'l'
                            },
                            val: order.info.countOfLines,
                            options: numbers
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
                    content: 'Количество внутренних номеров'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'select',
                            name: 'countOfNumbers',
                            mods: {
                                mode: 'radio',
                                theme: 'islands',
                                size: 'l'
                            },
                            val: order.info.countOfNumbers,
                            options: numbers
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
                    content: 'Количество внешних номеров'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block: 'select',
                            name: 'countOfOutNumbers',
                            mods: {
                                mode: 'radio',
                                theme: 'islands',
                                size: 'l'
                            },
                            val: order.info.countOfOutNumbers,
                            options: numbers
                        }
                    ]
                }
            ]
        }
    ]
})
