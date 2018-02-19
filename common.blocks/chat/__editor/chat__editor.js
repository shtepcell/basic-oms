modules.define('chat__editor', ['i-bem-dom', 'jquery'], function(provide, bemDom, $) {

provide(bemDom.declElem('chat', 'editor',
    {
        onSetMod: {
            js: {
                inited: function () {
                }
            }
        }
    },
    {

    })
);

});
