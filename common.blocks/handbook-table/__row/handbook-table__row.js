modules.define('handbook-table__row',
    ['i-bem-dom', 'button', 'BEMHTML', 'jquery'],
    function (provide, BEMDOM, Button, BEMHTML, $) {
    provide(BEMDOM.declElem('handbook-table', 'row', {
        onSetMod: {
            js: {
                inited: function () {
                    this._init();
                }
            },

            edited: {
                true: function(modName, modVal) {
                    var _this = this,
                        content =  BEMHTML.apply({
                            block: 'handbook-table',
                            elem: 'row',
                            elemMods: {
                                edited: true,
                                type: this._block().getMod('type')
                            },
                            cellsData: this.params.cellsData
                        });

                    BEMDOM.update(this.domElem, $(content).html());
                    this._chngSaveBtn = this.findChildElem({ elem: 'save-chng' }).findMixedBlock(Button);
                    this._chngCancelBtn = this.findChildElem({ elem: 'cancel-chng' }).findMixedBlock(Button);

                    this._chngSaveBtn && this._events(this._chngSaveBtn).on('click', _this._saveChanges);

                    this._chngCancelBtn && this._events(this._chngCancelBtn).on('click', function() {
                        _this.delMod('edited');
                    });
                },
                '': function() {
                    var _this = this,
                        content =  BEMHTML.apply({
                            block: 'handbook-table',
                            elem: 'row',
                            elemMods: {
                                type: this._block().getMod('type')
                            },
                            cellsData: this.params.cellsData
                        });

                    BEMDOM.update(this.domElem, $(content).html());
                    this._init();
                }
            }
        },

        _init: function() {
            var _this = this,
                _block = this._block(),
                chngBtn,
                dltBtn;

            this._typeValue = this._elem('row').getMod('type');

            chngBtn = this.findChildElem({ elem: 'chng-btn' });
            if (chngBtn) 
                this._chngBtn = chngBtn.findMixedBlock(Button);

            dltBtn = this.findChildElem({ elem: 'dlt-btn' });
            if (dltBtn) 
                this._dltBtn = dltBtn.findMixedBlock(Button);

            this._chngBtn && this._events(this._chngBtn).on('click', function() {
                _this.setMod('edited');
            });

            this._dltBtn && this._events(this._dltBtn).on('click', this._deleteRow);

            this._reinitPopupEvents();
            //_block && this._events(_block._popup).on('close', this._onPopupClose);
        },

        _reinitPopupEvents: function() {
            var popup = this._block()._popup;

            this._events(popup).un();
            this._events(popup).on('close', this._onPopupClose);
        },

        _saveChanges: function() {
            var _this = this,
                popup = this._block()._popup,
                data;

            this._chngSaveBtn.setMod('disabled');
            this._setPopupContent('Изменение...');

            this._reinitPopupEvents();
            this._events(_this._block()._popup)
                .once('OK', function() {
                    popup.hide();
                    popup.delMod('loading');
                    _this._chngSaveBtn.delMod('disabled');
                    _this._abortRequest();
                })
                .once('close', function() {
                    popup.hide();
                    popup.delMod('loading');
                    _this._chngSaveBtn.delMod('disabled');
                    _this._abortRequest();
                });

            popup.setMod('loading');
            popup.show();

            data = this._validate() || {};

            if (!this._errorText) {
                this._xhr = $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: '/admin/' + this._typeValue + '/change',
                    timeout: 5000,
                    data: {
                        obj: Object.assign({}, this.params.cellsData, data)
                    },
                    context: this,
                    error: function(err) {
                        var errText = err.responseJSON && err.responseJSON.errText ? '\n' + err.responseJSON.errText : ''

                        console.log('CHANGING requiest FAILED');
                        _this._setPopupContent('Ошибка!', undefined, 'Не удается отправить запрос' + errText);
                        popup.show();
                    },
                    success: function(res) {
                        console.log('CHANGING requiest DONE');
                        _this._setPopupContent('Информация', 'Данные успешно изменены');
                        popup.show();
                        // if (res.responceJSON.err) ... else ...
                        Object.assign(this.params.cellsData, data);
                        _this.delMod('edited');
                    },
                    complete: function() {
                        this._reinitPopupEvents();
                        this._events(_this._block()._popup)
                            .once('close', function() {
                                _this._chngSaveBtn.delMod('disabled');
                                popup.delMod('loading');
                            })
                            .once('OK', function() {
                                popup.hide();
                                _this._chngSaveBtn.delMod('disabled');
                                popup.delMod('loading');
                            });
                    }
                });
            } else {
                // показать _errortext в попапе
                this._events(popup)
                    .once('OK', function() {
                        popup.hide();
                        _this._chngSaveBtn.delMod('disabled');
                    });

                this._setPopupContent('Ошибка!', undefined, this._errorText);
                popup.show();
            }
        },

        _deleteRow: function() {
            var _this = this,
                popup = this._block()._popup;

            this._dltBtn.setMod('disabled');
            this._setPopupContent('Удаление...');

            this._reinitPopupEvents();
            this._events(_this._block()._popup)
                .once('OK', function() {
                    popup.hide();
                    popup.delMod('loading');
                    _this._dltBtn.delMod('disabled');
                    _this._abortRequest();
                })
                .once('close', function() {
                    popup.hide();
                    popup.delMod('loading');
                    _this._dltBtn.delMod('disabled');
                    _this._abortRequest();
                });

            popup.setMod('loading');
            popup.show();

            this._abortRequest();
            this._xhr = $.ajax({
                type: 'DELETE',
                dataType: 'json',
                url: '/admin/' + this._typeValue,
                timeout: 5000,
                data: {
                    obj: this.params.cellsData
                },
                context: this,
                error: function(err) {
                    var errText = err.responseJSON && err.responseJSON.errText ? '\n' + err.responseJSON.errText : ''
                    console.log('DELETE requiest FAILED', err);
                    _this._setPopupContent('Ошибка!', undefined, 'Не удается отправить запрос' + errText);
                    this._reinitPopupEvents();
                    popup.show();
                },
                success: function(res) {
                    console.log('DELETE requiest DONE', res)
                    _this._setPopupContent('Информация', 'Успешно удалено');
                    this._reinitPopupEvents();
                    _this._events(popup)
                        .once('OK', function() {
                            window.location.reload();
                        })
                        .once('close', function() {
                            window.location.reload();
                        });
                    // if (res.responceJSON.err) ... else ...
                },
                complete: function() {
                    _this._events(popup)
                        .once('close', function() {
                            _this._dltBtn.delMod('disabled');
                            popup.delMod('loading');
                        })
                        .once('OK', function() {
                            popup.hide();
                            _this._dltBtn.delMod('disabled');
                            popup.delMod('loading');
                        });
                }
            });
        },

        _abortRequest: function() {
            this._xhr && this._xhr.abort();
        },

        _onPopupClose: function() {
            // но вообще когда-либо тут могут появится всякие проверки
            // пред тем как закрыть модалку
            this._block()._popup.hide();
        },

        _setPopupContent: function(title, body, errText) {
            var bodyContent = errText ? {
                    elem: 'error-text',
                    content: errText
                } :
                body;

            this._block()._popup.setModalContent(BEMHTML.apply([
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
                    content: [
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
            ]));
        },

        _validate: function() { }
    }));
});