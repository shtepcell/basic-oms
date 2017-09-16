modules.define('order__button',
    ['i-bem-dom', 'button', 'jquery'], function (provide, BEMDOM, Button, $) {
    provide(BEMDOM.declElem('order', 'button', {
        onSetMod: {
            js: {
                inited: function () {
                    this._domEvents().on('click', this._onClick);
                }
            }
        },

        _onClick: function () {
            console.log(this.params);
            var data = this.params.data;

            $.ajax({
                url: this.params.url,
                type: 'POST',
                dataType: 'json',
                data: data,
                timeout: 5000,
                success: function () {
                    window.location.reload();
                }
            });
        }
    }));
});
