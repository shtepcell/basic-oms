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
                chngBtn,
                dltBtn;

            chngBtn = this.findChildElem({ elem: 'chng-btn' });
            if (chngBtn) 
                this._chngBtn = chngBtn.findMixedBlock(Button);

            dltBtn = this.findChildElem({ elem: 'dlt-btn' });
            if (dltBtn) 
                this._dltBtn = dltBtn.findMixedBlock(Button);

            this._chngBtn && this._events(this._chngBtn).on('click', function() {
                _this.setMod('edited');
            });
        },

        _saveChanges: function() {
            this._chngSaveBtn.setMod('disabled');

            this._xhrSave = $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '/admin/cities/change',
                data: {
                    cityData: this.params.cellsData
                },
                context: this
            }).fail(function() {
                console.log('CHANGING requiest FAILED');
            }).done(function(res) {
                console.log('CHANGING requiest DONE')
            });
        },

        _deleteCity: function() {
            this._dltBtn.setMod('disabled');

            this._xhrSave = $.ajax({
                type: 'DELETE',
                dataType: 'json',
                url: '/admin/cities/delete',
                data: {
                    cityData: this.params.cellsData
                },
                context: this
            }).fail(function(err) {
                console.log('DELETE requiest FAILED');
            }).done(function(res) {
                console.log('CHANGING requiest DONE')
                //+ показать плашку
                window.location.reload();
            });
        },

        _abortSaveRequest: function() {
            this._xhrSave && this._xhrSave.abort();
        }
    }));
});