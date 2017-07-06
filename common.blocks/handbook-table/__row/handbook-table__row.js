modules.define('handbook-table__row',
    ['i-bem-dom', 'button', 'BEMHTML'],
    function (provide, BEMDOM, Button, BEMHTML) {
    provide(BEMDOM.declElem('handbook-table', 'row', {
        onSetMod: {
            js: {
                inited: function () {
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
                }
            },

            edited: function (modName, modVal) {
                var content =  BEMHTML.apply({
                    block: 'handbook-table',
                    elem: 'row',
                    elemMods: {
                        edited: true,
                        type: 'cities'
                    },
                    cellsData: this.params.cellsData
                });

                BEMDOM.replace(this.domElem, content);
            }
        }
    }));
});