block('field').elem('adds').content()(function () {
    const { display, order } = this.ctx;

    if(display) {
        return [
            {
                block: 'order',
                elem: 'body-row',
                content: [
                    {
                        block: 'order',
                        elem: 'body-row-name',
                        content: 'д./кв. и т.д'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: order && order.info && order.info.adds
                    }
                ]
            }
        ]
    }
});

block('field').elem('adds').elemMod('access', true).content()(function () {
    const { display, order } = this.ctx;

    if(display) {
        return [
            {
                block: 'order',
                elem: 'body-row',
                content: [
                    {
                        block: 'order',
                        elem: 'body-row-name',
                        content: 'д./кв. и т.д *'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'input',
                                name: 'adds',
                                mods: {
                                    width: 'available',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                val: order && order.info && order.info.adds,
                                autocomplete: false,
                                placeholder: 'д.32, кв.15'
                            }
                        ]
                    }
                ]
            },
        ]
    }
})
