modules.define('action__add-params', ['i-bem-dom', 'location'], function(provide, bemDom, location) {

provide(bemDom.declElem('action', 'add-params',
    {
        onSetMod: {
            js: {
                inited: function () {
                    this._domEvents().on('click', function() {
                        location.change({ params: this.params.params });
                    })
                }
            }
        }
    },
    {

    })
);

});
