block('input')(
    def()(function() {
        this._required = this.ctx.required; // прокидываем значение поля потомкам
        return applyNext();
    }),
    elem('control').attrs()(function() {
        return this.extend(applyNext(), { required: this._required });
    })
);
