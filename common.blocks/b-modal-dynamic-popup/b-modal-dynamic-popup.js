modules.define('b-modal-dynamic-popup',
    ['i-bem-dom', 'BEMHTML', 'jquery', 'modal'],
    function (provide, BEMDOM, BEMHTML, $, Modal) {
    provide(BEMDOM.declBlock(this.name, {
        onSetMod: {
            js: {
                inited: function() {
                    var _this = this,
                        closeIcon;

                    this._modal = this._getModal();
                    closeIcon = this._modal.findChildElem('close-icon');
                    closeIcon && this._domEvents(closeIcon).on('click', function() {
                        this._emit('close');
                    });

                    this._initFooterButtons();
                }
            }
        },

        _getModal: function() {
            return this.findMixedBlock(Modal);
        },

        _initFooterButtons: function() { },

        show: function() {
            this._modal || (this._modal = this._getModal());
            this._modal.setMod('visible');
        },

        hide: function() {
            this._modal || (this._modal = this._getModal());
            this._modal.delMod('visible');
        },

        setModalBody: function(content) {

        },

        setModalContent: function(str) {
            BEMDOM.update(this.findChildElem('content').domElem, str);
            this._initFooterButtons();
            return this;
        }

    }, {
        create: function(appendTo, content, mods, mix, params) {
            var name = this.getName(),
                params = params || {};

            return BEMDOM.append(appendTo, BEMHTML.apply({
                    block: name,
                    mods: mods,
                    closable: params.closable,
                    content: content,
                    mix: mix
                })).bem(this);
        }
    }));
});