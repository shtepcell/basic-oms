block('order').elem('action').replace()(function () {
    const data = this.ctx.data;
    const id = data.id;
    const text = data.text;
    const to = data.to;

    if (this.ctx.display) {
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
    }
   
})
