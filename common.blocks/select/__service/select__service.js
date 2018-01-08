modules.define('select__service', ['i-bem-dom'], function(provide, bemDom) {

provide(bemDom.declElem('select', 'service',
    {
        onSetMod: {
            js: {
                inited: function () {
                    console.log('WORKS');
                }
            }
        }
    },
    {

    })
);

});
