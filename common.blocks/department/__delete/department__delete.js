modules.define('department__delete',
    ['i-bem-dom', 'button', 'jquery', 'dom', 'b-modal-dynamic-popup'],
    function (provide, BEMDOM, Button, $, dom, bModalDynPopup) {
    provide(BEMDOM.declElem('department', 'delete', {
        onSetMod: {
            js: {
                inited: function () {
                    var _this = this;
                    console.log(this.domElem['0'].firstChild);
                    this._popup = bModalDynPopup.create(
                        this.domElem['0'].firstChild,
                        null,
                        null,
                        [{
                            block: 'handbook',
                            elem: 'modal'
                        }],
                        {
                            closable: true
                        });

                    this._domEvents().on('click', this._onClick);
                }
            }
        },

        _reinitPopupEvents: function() {
            var popup = this._popup;

            this._events(popup).un();
            this._events(popup).on('close', function() {
                popup.hide();
            })
        },

        _onClick: function () {
            if (confirm(`Вы уверены, что хотите удалить этот отдел?`)) {
                var popup = this._popup;
                var _this = this;

                popup.setModalSectionContent('Сохранение...');

                this._reinitPopupEvents();
                this._events(popup)
                    .once('OK', function() {
                        popup.hide();
                        popup.delMod('loading');
                        _this._abortSaving();
                    })
                    .once('close', function() {
                        popup.hide();
                        popup.delMod('loading');
                        _this._abortSaving();
                    });

                dom.getFocused().blur();
                popup.setMod('loading');
                popup.show();

                $.ajax({
                    url: `/admin/departments/${this.params.department}/delete`,
                    type: 'POST',
                    dataType: 'json',
                    data: {},
                    timeout: 5000,
                    error: function(err) {

                        var errText = err.responseJSON && err.responseJSON.errText ? '\n' + err.responseJSON.errText : ''

                        if(err.responseJSON.length)
                            err.responseJSON.forEach( item => {
                                errText += item.errText + ' ';
                            });
                        else errText = err.responseJSON.errText;
                        popup.setModalSectionContent('Ошибка!', undefined, 'Не удается сохранить. ' + errText);
                        popup.show();
                    },
                    success: function (res) {
                        popup.setModalSectionContent('Информация', 'Данные успешно изменены');
                        popup.show();
                        _this._reinitPopupEvents();
                        _this._events(popup)
                            .once('close', function() {
                                if(res.url) window.location = res.url;
                                else window.location.reload();
                            })
                            .once('OK', function() {
                                if(res.url) window.location = res.url;
                                else window.location.reload();
                            });

                    }
                });
            }
        }
    }));
});
