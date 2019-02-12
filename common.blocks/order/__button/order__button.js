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
            var data = this.params;
            if (data.to == 'start-sks-build' || data.to == 'start-gzp-build' || data.to == 'start-stop-build') {
              data.incomeOnce = document.getElementsByName('income-once')[0].value;
              data.incomeMonth = document.getElementsByName('income-monthly')[0].value;
              var idExist = !!document.getElementsByName('idoss')[0];
              if (idExist)
                data.oss = document.getElementsByName('idoss')[0].value;

              if (data.incomeOnce == '' || data.incomeMonth == '' || (idExist && data.oss == '') ) {
                alert('Заполните требуемы поля!')
                return;
              }

              if (isNaN(data.incomeOnce) || isNaN(data.incomeMonth)) {
                alert('Доход должен быть числом!')
                return;
              }
            }

            if (confirm(`Вы уверены, что хотите ${data.text}?`)) {

                if (data.contact) {
                    const contact = prompt('Подтвердите актуальность контактных данных', data.contact);
                    if (contact == '' || contact == null) {
                        alert('Контактные данные не могут быть пустыми!');
                        return;
                    }
                    data.contact = contact;
                }
                
                $.ajax({
                    url: this.params.url,
                    type: 'POST',
                    dataType: 'json',
                    data: data,
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
