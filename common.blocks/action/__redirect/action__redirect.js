modules.define('action__redirect', ['i-bem-dom', 'jquery'], function(provide, bemDom, $) {

provide(bemDom.declElem('action', 'redirect',
    {
        onSetMod: {
            js: {
                inited: function () {
                    this._domEvents().on('click', function() {
                        window.location = this.params.url
                    })
                }
            }
        }
    },
    {

    })
);

});
