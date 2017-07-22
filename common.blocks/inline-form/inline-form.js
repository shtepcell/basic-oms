modules.define('inline-form',
    ['i-bem-dom', 'jquery', 'dom', 'b-modal-dynamic-popup', 'input'],
    function (provide, BEMDOM, $, dom, bModalDynPopup, Input) {
    provide(BEMDOM.declBlock('inline-form', {
        onSetMod: {
            js: {
                inited: function () {
                    var _this = this;

                    this._popup = bModalDynPopup.create(
                        this.domElem,
                        null,
                        null, 
                        [{
                            block: 'inline-form',
                            elem: 'modal'
                        }],
                        {
                            closable: true
                        });

                    this._domEvents(this).on('submit', function(e) {
                        var popup = this._popup;

                        e.preventDefault();
                        data = this._validate() || {};
                        popup.setModalSectionContent('Сохранение...');

                        this._reinitPopupEvents();
                        this._events(popup)
                            .once('OK', function() {
                                popup.hide();
                                popup.delMod('loading');
                                _this._abortSaving();
                            })
                            .once('close', function() {
                                popup.hide();
                                popup.delMod('loading');
                                _this._abortSaving();
                            });

                        dom.getFocused().blur();
                        popup.setMod('loading');
                        popup.show();

                        if (!this._errorText) {
                            this._abortSaving();
                            this.xhr = $.ajax({
                                url: _this.params.reqUrl || '/nothing',
                                type: 'POST',
                                dataType: 'json',
                                data: data,
                                timeout: 5000,
                                error: function(err) {
                                    var errText = err.responseJSON && err.responseJSON.errText ? '\n' + err.responseJSON.errText : ''

                                    popup.setModalSectionContent('Ошибка!', undefined, 'Не удается сохранить.' + errText);
                                    popup.show();
                                },
                                success: function(res) {
                                    popup.setModalSectionContent('Информация', 'Данные успешно изменены');
                                    popup.show();
                                    _this._reinitPopupEvents();
                                    _this._events(popup)
                                        .once('close', function() {
                                            window.location.reload();
                                        })
                                        .once('OK', function() {
                                            window.location.reload();
                                        });
                                },
                                complete: function() {
                                    _this._events(popup)
                                        .once('close', function() {
                                            popup.delMod('loading');
                                        })
                                        .once('OK', function() {
                                            popup.hide();
                                            popup.delMod('loading');
                                        });
                                }
                            });
                        } else {
                            this._events(popup)
                                .once('OK', function() {
                                    popup.hide();
                                });

                            popup.setModalSectionContent('Ошибка!', undefined, this._errorText);
                            popup.show();
                        }
                    });
                }
            }
        },

        _abortSaving: function() {
            this.xhr && this.xhr.abort();         
        },

        _reinitPopupEvents: function() {
            var popup = this._popup;

            this._events(popup).un();
            this._events(popup).on('close', function() {
                popup.hide();
            })
        },

        _validate: function() { }
    }));
});