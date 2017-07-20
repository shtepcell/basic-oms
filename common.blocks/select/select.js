modules.define(
    'select',
    ['i-bem-dom'],
    function(provide, bemDom) {

provide(bemDom.declBlock(this.name, {
    onSetMod: {
        focused : {
            true : function() {
                this.delMod('errored');
            }
        }
    }
},
{}))
});