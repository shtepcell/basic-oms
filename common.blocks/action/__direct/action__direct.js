modules.define('action__direct', ['i-bem-dom', 'jquery'], function(provide, bemDom, $) {

provide(bemDom.declElem('action', 'direct',
    {
        onSetMod: {
            js: {
                inited: function () {
                  this._domEvents().on('click', function() {

                    var question = `Вы уверены, что хотите изменить этап?`;
                    if(confirm(question)) {
                        $.ajax({
                            type: 'POST',
                            data: {
                                id: this.params.order,
                                stage: this.params.stage
                            },
                            url: '/changeStage',
                            timeout: 5000,
                            context: this,
                            error: function(err) {
                                console.log(err);
                                alert('Произошла ошибка! Попробуйте еще раз!');
                                window.location = window.location;
                            },
                            success: function(res) {
                                if (res.error) {
                                  alert(res.error)
                                } else
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
