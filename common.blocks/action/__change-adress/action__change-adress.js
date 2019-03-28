modules.define('action__change-adress', ['i-bem-dom', 'BEMHTML', 'radio-group', 'order__body', 'order__adress-info'], function(provide, bemDom, BEMHTML, Select, body, order) {

provide(bemDom.declElem('action', 'change-adress',
    {
        onSetMod: {
            js: {
                inited: function () {
                    this._events(this.findMixedBlock(Select)).on('change', function(e) {
                        var value = e.bemTarget._val,
                            b = this.findParentElem(body),
                            v = b.findChildElem(order);

                        bemDom.replace(
                            v.domElem,
                            BEMHTML.apply({
                                block: 'order',
                                elem: 'adress-info',
                                elemMods: {
                                    type: value,
                                    access: true
                                },
                                dataset: this.params.dataset
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
