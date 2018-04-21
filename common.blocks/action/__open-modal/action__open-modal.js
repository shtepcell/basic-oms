modules.define('action__open-modal', ['i-bem-dom', 'BEMHTML', 'modal'], function(provide, bemDom, BEMHTML, Modal) {

provide(bemDom.declElem('action', 'open-modal',
    {
        onSetMod: {
            js: {
                inited: function () {
                    var modal = this.findChildBlock(Modal);

                    this._domEvents().on('click', function() {
                        modal.setMod('visible', true);
                    });
                }
            }
        }
    },
    {

    })
);

});
