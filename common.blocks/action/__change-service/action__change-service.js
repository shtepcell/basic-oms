modules.define('action__change-service', ['i-bem-dom', 'BEMHTML', 'select', 'order__body', 'order__service-info'], function(provide, bemDom, BEMHTML, Select, body, order) {

provide(bemDom.declElem('action', 'change-service',
    {
        onSetMod: {
            js: {
                inited: function () {

                    this._events(this.findMixedBlock(Select)).on('change', function(e) {
                        var value = e.bemTarget._menu._val;
                        var b = this.findParentElem(body);
                        var v = b.findChildElem(order);

                        bemDom.replace(
                            v.domElem,
                            BEMHTML.apply({
                                block: 'order',
                                elem: 'service-info',
                                elemMods: {
                                    type: value
                                }
                            })
                        )

                    })
                }
            }
        }
    },
    {

    })
);

});
