block('order').elem('action').replace()(function () {
    const data = this.ctx.data;
    const { id, text, to, contact } = data;

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
                        to: to,
                        contact: contact
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
