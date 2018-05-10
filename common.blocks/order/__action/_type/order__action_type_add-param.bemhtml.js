block('order').elem('action').elemMod('type', 'add-param').replace()(function () {
    var data = this.ctx.data,
        id = data.id,
        text = data.text,
        to = data.to;

    if(this.ctx.display)
    return [
        {
            block: 'button',
            mix: {
                block: 'action',
                elem: 'add-params',
                js: {
                    params: {
                        admin: true
                    }
                }
            },
            mods: {
                theme: 'islands',
                size: 'm'
            },
            text: text
        }
    ]
})
