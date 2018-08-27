block('select').elem('ip').replace()(function () {
    return {
        block: 'select',
        mods: {
            mode: 'radio',
            theme: 'islands',
            size: 'l'
        },
        val: this.ctx.val,
        name: 'ip',
        options: [
            {
                text: '4 (факт. 1) = /30',
                val: '4 (факт. 1) = /30'
            },
            {
                text: '8 (факт. 5) = /29',
                val: '8 (факт. 5) = /29'
            },
            {
                text: '16 (факт. 13) = /28',
                val: '16 (факт. 13) = /28'
            },
            {
                text: '32 (факт. 29) = /27',
                val: '32 (факт. 29) = /27'
            }
        ]
    }
})
