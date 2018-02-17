modules.define('action__change-tech', ['i-bem-dom', 'BEMHTML', 'select', 'order__body', 'order__capability'], function(provide, bemDom, BEMHTML, Select, body, order) {

provide(bemDom.declElem('action', 'change-tech',
    {
        onSetMod: {
            js: {
                inited: function () {
                    console.log('HUY');
                    this._events(this.findMixedBlock(Select)).on('change', function(e) {
                        var value = e.bemTarget._menu._val;
                        var b = this.findParentElem(body);
                        var v = b.findChildElem(order);

                        bemDom.replace(
                            v.domElem,
                            BEMHTML.apply({
                                block: 'order',
                                elem: 'capability',
                                elemMods: {
                                    type: (!!value)?'yes':'no',
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
