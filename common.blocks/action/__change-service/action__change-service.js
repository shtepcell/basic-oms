modules.define('action__change-service', ['i-bem-dom', 'BEMHTML', 'select', 'order__body', 'order__service-info', 'gavno__vkusnoe'], function(provide, bemDom, BEMHTML, Select, body, order, Gavno) {

provide(bemDom.declElem('action', 'change-service',
    {
        onSetMod: {
            js: {
                inited: function () {

                    this._events(this.findMixedBlock(Select)).on('change', function(e) {
                        var value = e.bemTarget._menu._val;
                        var b = this.findParentElem(body);
                        var v = b.findChildElem(order);
                        var g = b.findChildElem(Gavno);
                        var ordr,
                            params = this.params;

                        if (params.service == value) {
                            ordr = {
                                info: {
                                    volume: params.volume,
                                    ip: params.ip,
                                    relation: params.relation
                                }
                            }
                        }

                        if (g) {
                            if (value == 'wifi' || value == 'wifiorg' || value == 'sks' || value == 'rrl') {
                                g.setMod('visible', false);
                            }
                            else {
                                g.setMod('visible');
                            }
                        } 

                        bemDom.replace(
                            v.domElem,
                            BEMHTML.apply({
                                block: 'order',
                                elem: 'service-info',
                                elemMods: {
                                    type: value,
                                    access: true
                                },
                                order: ordr
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
