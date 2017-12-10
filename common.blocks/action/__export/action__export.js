modules.define('action__export', ['i-bem-dom', 'location', 'jquery'], function(provide, bemDom, location, $) {

provide(bemDom.declElem('action', 'export',
    {
        onSetMod: {
            js: {
                inited: function () {
                    this._domEvents().on('click', function() {
                        location.change({url: '/export'});
                        location.change({params: this.params.query});
                    })
                }
            }
        }
    },
    {

    })
);

});
