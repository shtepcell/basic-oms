modules.define('pager__item',
    ['i-bem-dom', 'button', 'location'], function (provide, BEMDOM, Button, location) {
    provide(BEMDOM.declElem('pager', 'item', {
        onSetMod: {
            js: {
                inited: function () {
                    this._pagerId = this._block().domElem.attr('id');
                    this._button = this.findMixedBlock(Button);
                    this._button && this._events(this._button).on('click', this._onClick);
                    this._page = location.getUri().getParam('pager' + this._pagerId ) || 1;
                    location.on('change', function (e, state) {
                        if (!state.params.page) {
                            this._page = 1;
                        }
                    }, this);
                }
            },

            disabled: function (modName, modVal) {
                this._button.setMod('disabled', modVal);
            }
        },

        _onClick: function () {
            var params = {};

            params['pager' + this._pagerId] =  this.params.page;
            location.change({ params: params });
            window.location.reload();
        }
    }));
});