modules.define('action__change-stop-capability', ['i-bem-dom', 'BEMHTML', 'select', 'order__body', 'order__stop-info'], function(provide, bemDom, BEMHTML, Select, body, order) {

provide(bemDom.declElem('action', 'change-stop-capability',
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
                                elem: 'stop-info',
                                order: this.params.order,
                                dataset:this.params.dataset,
                                elemMods: {
                                    capability: (!!value)?'yes':'no',
                                    access: true
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
