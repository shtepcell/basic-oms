block('order').elem('action').elemMod('type', 'submit').replace()(function () {
    var data = this.ctx.data,
        id = data.id,
        text = data.text,
        to = data.to;

    if(this.ctx.display)
    return [
        {
            block: 'button',
            mods: {
                theme: 'islands',
                size: 'm',
                type: 'submit'
            },
            text: text
        }
    ]
})
