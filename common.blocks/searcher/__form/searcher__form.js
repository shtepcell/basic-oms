modules.define('searcher__form', ['i-bem-dom', 'location'], function (provide, bemDom, location) {

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
                    shutdown: [],
                    pauseService: [],
                    final: [],
                    manager: [],
                    client: '',
                    service: '',
                    city: ''
                };

                var arr = this.domElem.serializeArray();

                arr.forEach(item => {
                    if (item.name == 'manager') {
                        data[item.name].push(item.value);
                    } else {
                        data[item.name] = item.value;
                    }
                });

                var checkboxs = this.findChildBlocks(bemDom.declBlock('checkbox-group', {}));
                checkboxs.forEach(item => {
                    let val = item.getVal();
                    if (val.length > 0) {
                        var s = item.findChildElem(bemDom.declElem('checkbox', 'control', {}));
                        data[s.domElem[0].name] = val;
                    }
                })

                location.change({ params: data });
            }
        })
    );

})
