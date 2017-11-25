modules.define('order__body',
    ['i-bem-dom', 'jquery', 'dom', 'b-modal-dynamic-popup', 'input', 'attach'],
    function (provide, BEMDOM, $, dom, bModalDynPopup, Input, Attach) {
    provide(BEMDOM.declElem('order', 'body', {
        onSetMod: {
            js: {
                inited: function () {

                    var _this = this;
                    this._popup = bModalDynPopup.create(
                        this.domElem,
                        null,
                        null,
                        [{
                            block: 'order',
                            elem: 'modal'
                        }],
                        {
                            closable: true
                        });

                    this._domEvents(this).on('submit', function(e) {
                        var popup = this._popup;
                        var url = this.domElem[0].action;

                        e.preventDefault();
                        data = this._validate() || {};
                        var _file = data.file;
                        data = data.data;
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
                                url: url,
                                type: 'POST',
                                dataType: 'json',
                                contentType: (_file)?false:undefined,
                                processData: (_file)?false:undefined,
                                data: data,
                                timeout: 5000,
                                error: function(err) {

                                    var errText = err.responseJSON && err.responseJSON.errText ? '\n' + err.responseJSON.errText : ''

                                    if(err.responseJSON.length)
                                        err.responseJSON.forEach( item => {
                                            errText += item.errText + ' ';
                                        });
                                    else errText = err.responseJSON.errText;
                                    popup.setModalSectionContent('Ошибка!', undefined, 'Не удается сохранить. ' + errText);
                                    popup.show();
                                },
                                success: function(res) {
                                    popup.setModalSectionContent('Информация', 'Данные успешно изменены');
                                    popup.show();
                                    _this._reinitPopupEvents();
                                    _this._events(popup)
                                        .once('close', function() {
                                            if(res.url) window.location = res.url;
                                            else window.location.reload();
                                        })
                                        .once('OK', function() {
                                            if(res.url) window.location = res.url;
                                            else window.location.reload();
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

        _validate: function() {
            var form = this.domElem[0];
            var _data = this.domElem.serializeArray();
            var data = {};

            var file = this.findChildBlock(Attach);
            if(file) {
                var s = file.findChildElem('control');
                data = new FormData(form);
            } else {
                _data.forEach( item => {
                    data[item.name] = item.value;
                })
            }
            return {
                data: data,
                file: !!file
            };
        }
    }));
});
