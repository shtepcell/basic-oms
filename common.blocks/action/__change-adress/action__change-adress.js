modules.define('action__change-adress', ['i-bem-dom', 'BEMHTML', 'radio-group', 'order__body', 'order__adress-info'], function(provide, bemDom, BEMHTML, Select, body, order) {

provide(bemDom.declElem('action', 'change-adress',
    {
        onSetMod: {
            js: {
                inited: function () {
                    this._events(this.findMixedBlock(Select)).on('change', function(e) {
                        var value = e.bemTarget._val;
                        var b = this.findParentElem(body);
                        var v = b.findChildElem(order);

                        console.log('This went there');
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
