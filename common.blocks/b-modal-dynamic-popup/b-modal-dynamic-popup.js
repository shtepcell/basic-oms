modules.define('b-modal-dynamic-popup',
    ['i-bem-dom', 'BEMHTML', 'jquery', 'modal', 'button'],
    function (provide, BEMDOM, BEMHTML, $, Modal, Button) {
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
            },

            loading: {
                true: function(modName, modVal) {
                    // console.log(this._elem('body'), 'loading');
                    BEMDOM.append(this._elem('body').domElem, BEMHTML.apply({
                        block: 'b-modal-dynamic-popup',
                        elem: 'loader'
                    }));
                },

                '': function() {
                    var loader = this._elem('loader');
                    loader && BEMDOM.replace(loader.domElem, '');
                }
            }
        },

        _getModal: function() {
            return this.findMixedBlock(Modal);
        },

        /*
         * Первые две кнопки в футере -> OK & CANCEL
         */
        _initFooterButtons: function() {
            var footer = this.findChildElem('foot'),
                btnOk,
                btnCancel,
                btns;

            if (footer) {
                btns = footer.findChildBlocks(Button);
                btnOk = btns.get(0);
                btnCancel = btns.get(1);

                btnOk && this._domEvents(btnOk).on('click', function() {
                    this._emit('OK');
                });

                btnCancel && this._domEvents(btnCancel).on('click', function() {
                    this._emit('CANCEL');
                });
            }
            // console.log(footer, btns);
        },

        show: function() {
            this._modal || (this._modal = this._getModal());
            this._modal.setMod('visible');
        },

        hide: function() {
            this._modal || (this._modal = this._getModal());
            this._modal.delMod('visible');
        },

        setModalBody: function(str) {

        },

        setModalContent: function(str) {
            BEMDOM.update(this.findChildElem('content').domElem, str);
            this._initFooterButtons();
            return this;
        },

        setModalSectionContent: function(title, body, errText, btns) {
            var bodyContent = errText ? {
                    elem: 'error-text',
                    content: errText
                } :
                body,
                buttonsCtx = [];

            if (btns && btns.length > 0) {
                buttonsCtx = btns.map(function(item) {
                    return {
                        block: 'button',
                        mods: {
                            theme: 'islands',
                            size: 's'
                        },
                        text: item
                    }
                });
            } else {
                buttonsCtx = [
                    {
                        block: 'button',
                        mods: {
                            theme: 'islands',
                            size: 's'
                        },
                        text: 'OK'
                    }
                ]
            }

            this.setModalContent(BEMHTML.apply([
                {
                    block: 'b-modal-dynamic-popup',
                    elem: 'head',
                    content: title
                },
                {
                    block: 'b-modal-dynamic-popup',
                    elem: 'body',
                    content: bodyContent
                },
                {
                    block: 'b-modal-dynamic-popup',
                    elem: 'foot',
                    content: buttonsCtx
                }
            ]));
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
