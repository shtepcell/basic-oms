block('select').elem('ip').replace()(function () {
    const ips = ['4 (факт. 1) = /30', '8 (факт. 5) = /29', '16 (факт. 13) = /28', '32 (факт. 29) = /27'];

    if (this.ctx.val && !ips.includes(this.ctx.val)) {
        ips.unshift(this.ctx.val)
    }

    return {
        block: 'select',
        mods: {
            mode: 'radio',
            theme: 'islands',
            size: 'l'
        },
        val: this.ctx.val,
        name: 'ip',
        options: ips.map((item) => ({ text: item, val: item }))
    }
})
