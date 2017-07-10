modules.define('handbook-table__row',
    ['i-bem-dom', 'button', 'BEMHTML', 'jquery'],
    function (provide, BEMDOM, Button, BEMHTML, $) {
    provide(BEMDOM.declElem('handbook-table', 'row', {
        onSetMod: {
            js: {
                inited: function () {
                    this.init();
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
                                type: 'cities'
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
                                type: 'cities'
                            },
                            cellsData: this.params.cellsData
                        });

                    BEMDOM.update(this.domElem, $(content).html());
                    this.init();
                }
            }
        },

        init: function() {
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

            _block && this._events(_block._popup).on('close', this._onPopupClose);
        },

        _saveChanges: function() {
            var _this = this;

            this._chngSaveBtn.setMod('disabled');

            console.log(this, '-------ELEM------');

            this._validate();

            if (!this._errorText) {
                this._xhrSave = $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: '/admin/' + this._typeValue + '/change',
                    data: {
                        obj: this.params.cellsData
                    },
                    context: this
                }).fail(function() {
                    console.log('CHANGING requiest FAILED');
                }).then(function(res) {
                    console.log('CHANGING requiest DONE');
                    // if (res.responceJSON.err) ... else ...
                }).always(function() {
                    _this._events(_this._block()._popup).once('close', function() {
                        _this._chngSaveBtn.delMod('disabled')
                    });
                });
            } else {
                // показать _errortext в попапе
            }
        },

        _deleteRow: function() {
            var _this = this;

            this._dltBtn.setMod('disabled');
            this._block()._popup.show();

            this._xhrSave = $.ajax({
                type: 'DELETE',
                dataType: 'json',
                url: '/admin/' + this._typeValue + '/delete',
                data: {
                    obj: this.params.cellsData
                },
                context: this
            }).catch(function(err) {
                console.log('DELETE requiest FAILED', err);
            }).then(function(res) {
                console.log('CHANGING requiest DONE', res)
                //+ показать плашку
                //window.location.reload();
                // if (res.responceJSON.err) ... else ...
            }).always(function() {
                _this._events(_this._block()._popup).once('close', function() {
                    _this._dltBtn.delMod('disabled')
                });
            });
        },

        _abortSaveRequest: function() {
            this._xhrSave && this._xhrSave.abort();
        },

        _onPopupClose: function() {
            // но вообще когда-либо тут могут появится всякие проверки
            // пред тем как закрыть модалку
            this._block()._popup.hide();
        },

        _validate: function() { }
    }));
});