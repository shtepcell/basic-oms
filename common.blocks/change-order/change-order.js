modules.define('change-order', ['i-bem-dom', 'jquery', 'button', 'select'],
    function(provide, bemDom, $, Button, Select) {

provide(bemDom.declBlock('change-order',
    {
        onSetMod: {
            js: {
                inited: function () {
                  const id = this.params.id;
                  const send = document.getElementsByClassName('mne__vpadlu')[0];
                  const pre = this.findChildBlock(Select).getVal();

                  send.onclick = () => {
                    const volume = this.findChildBlock(Select).getVal();
                    
                    if (volume == pre) {
                      alert('Текущая ёмкость совпадает с выбранной. Нужно выбрать ёмкость отличную от текущей!')
                      return;
                    }

                    if (confirm(`Вы уверены, что хотите изменить ёмкость на ${volume}?`)) 
                      $.ajax({
                        type: 'POST',
                        url: '/change-order/'+id,
                        data: {
                          volume: volume
                        },
                        success: function (res) {
                          window.location = `/order/${id}/info`
                        }
                      });
                  }
                }
            }
        }
    },
    {

    })
);

});
