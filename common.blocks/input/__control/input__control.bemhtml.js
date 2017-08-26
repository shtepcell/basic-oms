block('input')(
    def()(function() {
        this._required = this.ctx.required; // прокидываем значение поля потомкам
        this._type = this.ctx.type;
        return applyNext();
    }),
    elem('control').attrs()(function() {
        return this.extend(applyNext(), { required: this._required, type: this._type });
    })
);
