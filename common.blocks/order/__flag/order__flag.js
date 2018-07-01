modules.define('order__flag', ['i-bem-dom', 'BEMHTML', 'jquery'], function(provide, bemDom, BEMHTML, $) {

provide(bemDom.declElem('order', 'flag',
    {
        onSetMod: {
            js: {
                inited: function () {
                    var state = this.params.state || 0,
                        id = this.params.id;

                    this._domEvents().on('click', function(e) {
                        e.preventDefault();
                        if(state == 4) {
                            state = 0;
                        } else state++;
                        this.setMod('color', state);

                        $.ajax({
                            type: 'POST',
                            dataType: 'json',
                            url: `/flag/${id}`,
                            timeout: 5000,
                            data: {
                                state: state
                            }
                        })
                    });
                }
            }
        }
    },
    {

    })
);

});
