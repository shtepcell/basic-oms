block('b-modal-dynamic-popup').replace()(function() {
    var mixed = this.ctx.mix || [];

    mixed.push({ 
        block: 'b-modal-dynamic-popup',
        mods: this.ctx.mods
    });

    return {
        block: 'modal',
        js: true,
        mods: {
            theme: 'islands',
            closable: this.ctx.closable
        },
        mix: mixed,
        content: {
            block: 'b-modal-dynamic-popup',
            elem: 'content',
            content: this.ctx.content || ''
        }
    };
});
