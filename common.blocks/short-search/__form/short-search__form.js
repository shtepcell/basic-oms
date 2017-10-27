modules.define('short-search__form', ['i-bem-dom', 'location'], function(provide, bemDom, location) {

provide(bemDom.declElem('short-search', 'form',
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
                name: '',
                pagerclients: '',
                pagercities: '',
                pagerproviders: ''
            };

            var arr = this.domElem.serializeArray();
            arr.forEach( item => {
                data[item.name] = item.value;
            });

            location.change({params: data});
        }
    })
);

})
