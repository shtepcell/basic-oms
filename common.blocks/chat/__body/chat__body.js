modules.define('chat__body', ['i-bem-dom', 'jquery'], function(provide, bemDom, $) {

provide(bemDom.declElem('chat', 'body',
    {
        onSetMod: {
            js: {
                inited: function () {}
            }
        }
    },
    {

    })
);

});
