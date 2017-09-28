modules.define('searcher__form', ['i-bem-dom', 'location'], function(provide, bemDom, location) {

provide(bemDom.declElem('searcher', 'form',
    {
        onSetMod: {
            js: {
                inited: function () {
                    this._domEvents().on('submit', this._onSubmit);
                }
            }
        },
        _onSubmit: function (e) {
            e.preventDefault();
            var data = {
                pagerfirst: 1,
                id: '',
                cms: '',
                func: [],
                pre: [],
                build: [],
                final: [],
                client: '',
                service: '',
                city: ''
            };

            var arr = this.domElem.serializeArray();
            arr.forEach( item => {
                data[item.name] = item.value;
            });
            if(data.id.length > 0 && isNaN(data.id)) {
                alert('ID должен быть числом')
                return;
            }
            var checkboxs = this.findChildBlocks(bemDom.declBlock('checkbox-group', {}));
            checkboxs.forEach( item => {
                let val = item.getVal();
                if(val.length > 0) {
                    var s = item.findChildElem(bemDom.declElem('checkbox', 'control', {}));
                    data[s.domElem[0].name] = val;
                }
            })

            location.change({ params: data});
        }
    })
);

})
