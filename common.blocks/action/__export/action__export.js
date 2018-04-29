modules.define('action__export', ['i-bem-dom', 'location', 'jquery'], function(provide, bemDom, location, $) {

provide(bemDom.declElem('action', 'export',
    {
        onSetMod: {
            js: {
                inited: function () {
                    this._domEvents().on('click', function() {
                        var str = "";
                        for (var key in this.params.query) {
                            if (str != "") {
                                str += "&";
                            }
                            str += key + "=" + encodeURIComponent(this.params.query[key]);
                        }
                        window.open('/export?'+str);
                    })
                }
            }
        }
    },
    {

    })
);

});
