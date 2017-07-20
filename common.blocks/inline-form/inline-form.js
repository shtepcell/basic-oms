modules.define('inline-form',
    ['i-bem-dom', 'jquery'],
    function (provide, BEMDOM, $) {
    provide(BEMDOM.declBlock('inline-form', {
        onSetMod: {
            js: {
                inited: function () {
                    this._domEvents(this).on('submit', function(e) {
                        e.preventDefault();
                        data = this.validate() || {};

                        if (this._errText) {
                            $.ajax({
                                url: 'admin/' + this._block().getMod('type') + '/add',
                                type: 'POST',
                                dataType: 'json',
                                data: data
                            });
                        } else {
                            // show popup
                        }
                    });
                }
            }
        },

        validate: function() { }
    }));
});