modules.define('admin-settings', ['i-bem-dom', 'jquery'], function(provide, bemDom, $) {
    provide(bemDom.declBlock('admin-settings', {
        onSetMod: {
            js: {
                inited: function () {
                }
            }
        },

        onSubmit: function (event) {
            event.preventDefault();

            const settings = this._elem('form').domElem.serializeArray().map(({ name, value }) => ({
                type: name,
                data: value,
            }));

            $.ajax({
                type: 'POST',
                data: {
                    settings
                },
                url: '/api/admin/configuration',
                timeout: 5000,
                context: this,
                error: function(err) {
                    console.log(err);
                    alert('Произошла ошибка! Попробуйте еще раз!');
                },
                success: function(res) {
                    alert('Сохранено!');
                }
            })
        }
    },
    {
        lazyInit: true,

        onInit: function() {
            this._domEvents('form').on('submit', this.prototype.onSubmit);
        }
    }));
});
