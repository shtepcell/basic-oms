modules.define('action__redirect-to', ['i-bem-dom', 'BEMHTML', 'jquery', 'select'], function(provide, bemDom, BEMHTML, $, Select) {

provide(bemDom.declElem('action', 'redirect-to',
    {
        onSetMod: {
            js: {
                inited: function () {
                    var id = this.params.id;

                    this._events(this.findMixedBlock(Select)).on('change', function(e) {
                        var value = e.bemTarget._menu._val;
                        var question = `Вы уверены, что хотите изменить зону обслуживания на ${value}?`;

                        if(confirm(question)) {
                            $.ajax({
                                type: 'POST',
                                data: {
                                    id: id,
                                    department: value
                                },
                                url: '/changeRespDep',
                                timeout: 5000,
                                context: this,
                                error: function(err) {
                                    console.log(err);
                                    alert('Произошла ошибка! Попробуйте еще раз!');
                                    window.location = window.location;
                                },
                                success: function(res) {
                                    console.log(res);
                                    window.location = window.location;
                                }
                            })
                        }
                    })

                }
            }
        }
    },
    {

    })
);

});
