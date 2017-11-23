modules.define('user__delete',
    ['i-bem-dom', 'button', 'jquery'], function (provide, BEMDOM, Button, $) {
    provide(BEMDOM.declElem('user', 'delete', {
        onSetMod: {
            js: {
                inited: function () {
                    this._domEvents().on('click', this._onClick);
                }
            }
        },

        _onClick: function () {
            if (confirm(`Вы уверены, что хотите удалить этого пользователя?`)) {
                $.ajax({
                    url: `/admin/users/${this.params.user}/delete`,
                    type: 'POST',
                    dataType: 'json',
                    data: {},
                    timeout: 5000,
                    success: function (res) {
                        if(res.url) window.location = res.url;
                        else window.location.reload();
                    }
                });
            }
        }
    }));
});
