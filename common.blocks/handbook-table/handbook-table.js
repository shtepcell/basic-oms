modules.define('handbook-table',
    ['i-bem-dom', 'BEMHTML', 'modal', 'b-modal-dynamic-popup'],
    function (provide, BEMDOM, BEMHTML, Modal, bModalDynPopup) {
    provide(BEMDOM.declBlock('handbook-table', {
        onSetMod: {
            js: {
                inited: function () {
                    this._popup = bModalDynPopup.create(
                        this.domElem,
                        null,
                        null, 
                        [{
                            block: 'handbook-table',
                            elem: 'modal'
                        }],
                        {
                            closable: true
                        });

                    this._events(this._popup).on('close', function() {
                        console.log('popup closed!');
                    });
                }
            }
        }
    }));
});