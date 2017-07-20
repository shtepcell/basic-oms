modules.define('input', ['i-bem-dom', 'control'], function(provide, bemDom, Control) {

provide(bemDom.declBlock(this.name, Control, {
    onSetMod: {
        focused: {
            true: function() {
                this.__base.apply(this, arguments);
                this.delMod('errored');
            }
        }
    }
},
{}));

});