modules.define('order__clipboard', ['i-bem-dom', 'jquery'], function(provide, bemDom, $) {

provide(bemDom.declElem('order', 'clipboard',
    {
        onSetMod: {
            js: {
                inited: function () {
                    var str = this.params.str;

                    this._domEvents().on('click', function() {
                      const el = document.createElement('textarea');
                      el.value = str;
                      document.body.appendChild(el);
                      el.select();
                      document.execCommand('copy');
                      document.body.removeChild(el);
                      alert('Скопировано!')
                    })
                }
            }
        }
    },
    {

    })
);

});
