modules.define('body', ['i-bem-dom'], function(provide, bemDom) {

provide(bemDom.declBlock('body', {
    onSetMod: {
        js: {
            inited: function () {
            }
        }
    }
},
{}));

});
