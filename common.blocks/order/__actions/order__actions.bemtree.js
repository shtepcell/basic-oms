block('order').elem('actions').content()(function () {
    var order = this.ctx.order,
        user = this.ctx.user,
        tab = this.ctx.tab;

        var actions = {
            info: [
                {
                    text: 'Отправить на проработку по ГЗП',
                    to: 'start-pre-gzp',
                    condition: function (user, order) {
                        var access = (order.info.initiator.department._id == user.department._id + '');
                        if(order.status == 'client-match' && access && !order.gzp.complete) {
                            return true;
                        } else return false;
                    }
                },
                {
                    text: 'Отправить на проработку по STOP/VSAT',
                    to: 'start-pre-stop',
                    condition: function (user, order) {
                        var access = (order.info.initiator.department._id == user.department._id + '');
                        if(order.status == 'client-match' && access && !order.stop.complete) {
                            return true;
                        } else return false;
                    }
                },
                {
                    text: 'Отправить на организацию по ГЗП',
                    to: 'start-gzp-build',
                    condition: function (user, order) {
                        var access = (order.info.initiator.department._id == user.department._id + '');
                        if(order.status == 'client-match' && access && order.gzp.complete) {
                            return true;
                        } else return false;
                    }
                },
                {
                    text: 'Отправить на организацию по STOP/VSAT',
                    to: 'start-stop-build',
                    condition: function (user, order) {
                        var access = (order.info.initiator.department._id == user.department._id + '');
                        if(order.status == 'client-match' && access && order.stop.complete) {
                            return true;
                        } else return false;
                    }
                },
                {
                    text: 'Настройка сети завершена',
                    to: 'end-network',
                    condition: function (user, order) {
                        if(order.status == 'network' && user.department.type == 'net')
                            return true;
                        else return false;
                    }
                }
            ],
            gzp: [
                {
                    text: 'Организация завершена',
                    to: 'end-build',
                    condition: function (user, order) {
                        if( order.status == 'gzp-build' &&
                            user.department.type == 'gus' &&
                            user.department.cities.indexOf(order.info.city._id) >= 0 ) {
                                return true;
                            }
                        else return false;
                    }
                },
                {
                    text: 'Оборудование установлено',
                    to: 'end-install-devices',
                    condition: function (user, order) {
                        if(order.status == 'install-devices' && user.department.type == 'gus' &&
                            user.department.cities.indexOf(order.info.city._id) >= 0 )
                            return true;
                        else return false;
                    }
                }
            ],
            stop: [
                {
                    text: 'Организация завершена',
                    to: 'end-build-stop',
                    condition: function (user, order) {
                        if( order.status == 'stop-build' &&
                            user.department.type == 'b2o') {
                                return true;
                            }
                        else return false;
                    }
                }
            ]
        };

        var ret = [];

        actions[tab].forEach( item => {
            if( item.condition(user, order) ) {
                ret.push({
                    block: 'order',
                    elem: 'action',
                    content: {
                        block: 'order',
                        elem: 'button',

                        js: {
                            data: {
                                to: item.to
                            },
                            url: `/order/${order.id}/action`
                        },
                        text: item.text
                    }
                })
            }
        })

        if( tab == 'info' && order.status == 'client-notify' && user.department._id == ''+order.info.initiator.department._id ) {
                ret.push({
                    block: 'order',
                    elem: 'action',
                    content: {
                        block: 'button',
                        mix: {
                            block: 'order',
                            elem: 'action'
                        },
                        mods: {
                            theme: 'islands',
                            size: 'l',
                            type: 'submit'
                        },
                        text: 'Заказ выполнен'
                    }
                })
            }

        if( tab == 'stop' && (order.status == 'stop-pre' || order.status == 'all-pre') && user.department.type == 'b2o') {
                ret.push({
                    block: 'order',
                    elem: 'action',
                    content: {
                        block: 'button',
                        mix: {
                            block: 'order',
                            elem: 'action'
                        },
                        mods: {
                            theme: 'islands',
                            size: 'l',
                            type: 'submit'
                        },
                        text: 'Проработка завершена'
                    }
                })
            }

        if( tab == 'gzp' && (order.status == 'gzp-pre' || order.status == 'all-pre') && user.department.type == 'gus' &&
            user.department.cities.indexOf(order.info.city._id) >= 0) {
                ret.push({
                    block: 'order',
                    elem: 'action',
                    content: {
                        block: 'button',
                        mix: {
                            block: 'order',
                            elem: 'action'
                        },
                        mods: {
                            theme: 'islands',
                            size: 'l',
                            type: 'submit'
                        },
                        text: 'Проработка завершена'
                    }
                })
            }
        return ret;

})
