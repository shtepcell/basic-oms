modules.define('order__priority', ['i-bem-dom', 'jquery'], function (provide, bemDom, $) {
    provide(bemDom.declElem('order', 'priority', {
        onSetMod: {
            js: {
                inited: function () {
                    this._domEvents().on('click', this._onClick);
                }
            }
        },

        _onClick: function () {
            const state = this.getMod('active');

            if (!state && confirm('Сделать этот заказ приоритетным?')) {
                this._setPriority(state);
            }

            if (state && confirm('Выключить приоритет у этого заказа?')) {
                this._setPriority(state);
            }
        },

        _setPriority: function (state) {
            const { orderId } = this.params;

            $.ajax({
                url: `/api/order/${orderId}/priority`,
                type: 'POST',
                dataType: 'json',
                data: {
                    priority: !state,
                },
                timeout: 5000,
                context: this,
                error: (err) => {
                    console.error(err);

                    alert('Что-то пошло не так');
                },
                success: () => {
                    this.setMod('active', !state);
                }
            })
        }
    },
        {
        }
    ));
})
