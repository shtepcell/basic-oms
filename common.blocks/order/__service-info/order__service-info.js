modules.define('order__service-info', ['i-bem-dom'], function(provide, bemDom) {

provide(bemDom.declElem('order', 'service-info',
    {
        onSetMod: {
            js: {
                inited: function () {
                    console.log('Ok');
                }
            }
        }
    },
    {

    })
);

});
