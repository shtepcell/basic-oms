block('inline-form')(
    content()(function() {
        var _this = this;

        return {
            elem: 'controls',
            data: _this.ctx.localParams,
            content: [
                {
                    block: 'button',
                    text: 'Сохранить',
                    mods: {
                        theme: 'islands',
                        size: 'm',
                        type: 'submit'
                    },
                    mix: {
                        block: 'inline-form',
                        elem: 'save-btn'
                    }
                }
            ]
        };
    }),
    tag()('form'),
    js()(function() {
        var url = (this.ctx.js && this.ctx.js.reqUrl) || (this.ctx.attrs && this.ctx.attrs.method);

        return Object.assign(this.ctx.js || {}, {
            reqUrl: url || '/nothing'
        })
    })
);

block('inline-form').elem('controls').wrap()(function() {
    var _content = this.ctx.content;

    return {
        block: 'control-group',
        content: _content
    }
});