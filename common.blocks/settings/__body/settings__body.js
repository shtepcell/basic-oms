modules.define('settings__body', ['i-bem-dom', 'jquery', 'location', 'modal'], function(provide, bemDom, $, location, Modal) {

provide(bemDom.declElem('settings', 'body',
    {
        onSetMod: {
            js: {
                inited: function () {
                    var modal = this.findParentBlock(Modal);

                    this._domEvents().on('submit', function (e) {
                        e.preventDefault();

                        var arr = this.domElem.serializeArray(),
                            data = {};

                        arr.forEach( item => {
                            if(!data[item.name])
                                {data[item.name] = [];}

                            data[item.name].push(item.value)
                        })

                        $.ajax({
                            url: this.params.action,
                            type: 'POST',
                            dataType: 'json',
                            data: data,
                            timeout: 5000,
                            error: function(err) {
                                alert('Ошибка при сохранении!');
                            },
                            success: function(res) {
                                modal.setMod('visible', false);
                                window.location.reload();
                            }
                        });
                    });
                }
            }
        }
    })
);

})
