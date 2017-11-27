modules.define('table__row', ['i-bem-dom', 'jquery'], function(provide, bemDom, $) {

provide(bemDom.declElem('table', 'row',
    {
        onSetMod: {
            js: {
                inited: function () {
                    this._domEvents().on('click', function() {
                        $.ajax({
                            type: 'POST',
                            dataType: 'json',
                            url: this.params.url,
                            timeout: 5000,
                            context: this,
                            error: function(err) {
                                alert('Произошла ошибка! Попробуйте еще раз!');
                            },
                            success: function(res) {
                                window.location = res.url;
                            }
                        })
                    })
                }
            }
        }
    },
    {

    })
);

});
