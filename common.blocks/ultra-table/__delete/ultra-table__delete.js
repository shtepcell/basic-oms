modules.define('ultra-table__delete', ['i-bem-dom', 'jquery'], function(provide, bemDom, $) {

provide(bemDom.declElem('ultra-table', 'delete', {
        onSetMod : {
                js : {
                    inited: function() {
                        this._domEvents().on('click', function() {
                            if(confirm('Вы уверены, что хотите удалить этот город из списка?')) {
                                this._xhr = $.ajax({
                                    type: 'POST',
                                    dataType: 'json',
                                    url: window.location.pathname +'/delete/'+ this.params._id,
                                    timeout: 5000,
                                    context: this,
                                    error: function(err) {
                                        alert('Ошибка при удалении');
                                        console.log('CHANGING requiest FAILED');
                                    },
                                    success: function(res) {
                                        window.location = window.location;
                                        console.log('CHANGING requiest DONE');
                                    }
                                });
                            } 
                        });
                    }
                }
            }
    })
);

});
