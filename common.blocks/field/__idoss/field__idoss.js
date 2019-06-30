modules.define('field__idoss', ['i-bem-dom', 'input'], function(provide, bemDom, Input) {

    provide(bemDom.declElem('field', 'idoss', {
        onSetMod: {
            js: {
                inited: function () {
                    this._input = this.findChildBlock(Input);
                }
            }
        },

        setVal: function(val) {
            this._input.setVal(val);
        }
    },
    {}));

    });
