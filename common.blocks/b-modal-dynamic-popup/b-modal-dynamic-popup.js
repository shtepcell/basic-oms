modules.define('b-modal-dynamic-popup',
    ['i-bem-dom', 'BEMHTML', 'jquery', 'modal'],
    function (provide, BEMDOM, BEMHTML, $, Modal) {
    provide(BEMDOM.declBlock(this.name, {
        onSetMod: {
            js: {
                inited: function() {
                    this._modal = this._getModal();
                    console.log('BLOCK-inited__MODAL', this._modal);
                    //this._modal.setMod('visible');
                }
            }
        },

        _getModal: function() {
            return this.findMixedBlock(Modal);
        },

        show: function() {
            this._modal || (this._modal = this._getModal());
            this._modal.setMod('visible');
        },

        hide: function() {
            this._modal || (this._modal = this._getModal());
            this._modal.delMod('visible');
        },

        setModalBody: function(content) {

        }

    }, {
        create: function(appendTo, mods, params) {
            var name = this.getName(),
                params = params || {};

            return BEMDOM.append(appendTo, BEMHTML.apply({
                    block: name,
                    mods: mods,
                    closable: params.closable
                })).bem(this);
        }
    }));
});