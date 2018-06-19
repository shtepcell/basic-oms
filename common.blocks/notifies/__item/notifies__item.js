modules.define('notifies__item', ['i-bem-dom', 'jquery'],
    function(provide, bemDom, $) {

provide(bemDom.declElem('notifies', 'item',
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
