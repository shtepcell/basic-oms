modules.define('inline-form',
    ['i-bem-dom', 'jquery', 'b-modal-dynamic-popup'],
    function (provide, BEMDOM, $, bModalDynPopup) {
    provide(BEMDOM.declBlock('inline-form', {
        onSetMod: {
            js: {
                inited: function () {
                    this._popup = bModalDynPopup.create(
                        this.domElem,
                        null,
                        null, 
                        [],
                        {
                            closable: true
                        });

                    this._domEvents(this).on('submit', function(e) {
                        e.preventDefault();
                        data = this._validate() || {};

                        if (this._errText) {
                            this._abortSaving();
                            this.xhr = $.ajax({
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

        _abortSaving: function() {
            this.xhr && this.xhr.abort();         
        },

        _validate: function() { }
    }));
});