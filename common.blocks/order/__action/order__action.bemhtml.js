block('order').elem('action').replace()(function () {
    var data = this.ctx.data,
        id = data.id,
        text = data.text,
        to = data.to;

    if(this.ctx.display)
    return [
        {
            block: 'button',
            mix: {
                block: 'order',
                elem: 'button',
                js: {
                    url: `/order/${id}/action`,
                    text: text,
                    to: to
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
