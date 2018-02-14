modules.define('action__change-gzp-need', ['i-bem-dom', 'BEMHTML', 'select', 'order__body', 'order__gzp-info'], function(provide, bemDom, BEMHTML, Select, body, order) {

provide(bemDom.declElem('action', 'change-gzp-need',
    {
        onSetMod: {
            js: {
                inited: function () {
                    console.log('sdasds');
                    this._events(this.findMixedBlock(Select)).on('change', function(e) {
                        var value = e.bemTarget._menu._val;
                        var b = this.findParentElem(body);
                        var v = b.findChildElem(order);

                        bemDom.replace(
                            v.domElem,
                            BEMHTML.apply({
                                block: 'order',
                                elem: 'gzp-info',
                                elemMods: {
                                    need: (!!value)?'yes':'no',
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
