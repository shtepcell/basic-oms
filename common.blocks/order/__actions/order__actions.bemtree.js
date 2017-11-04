block('order').elem('actions').content()(function () {
    var order = this.ctx.order,
        user = this.ctx.user,
        adminEdit = this.ctx.admin,
        tab = this.ctx.tab;

        var actions = {
            init: [],
            info: [
                {
                    text: 'Отправить на проработку по ГЗП',
                    to: 'start-pre-gzp',
                    condition: function (user, order) {
                        var access = (order.info.initiator.department._id == user.department._id + '');
                        return (order.status == 'client-match' && access && !order.gzp.complete);
                    }
                },
                {
                    text: 'Отправить на проработку по STOP/VSAT',
                    to: 'start-pre-stop',
                    condition: function (user, order) {
                        var access = (order.info.initiator.department._id == user.department._id + '');
                        return (order.status == 'client-match' && access && !order.stop.complete)
                    }
                },
                {
                    text: 'Отправить на организацию по ГЗП',
                    to: 'start-gzp-build',
                    condition: function (user, order) {
                        var access = (order.info.initiator.department._id == user.department._id + '');
                        var income = (order.info['cost-once'] != null && order.info['cost-monthly']);
                        return (order.status == 'client-match' && access && income && order.gzp.complete && order.gzp.capability)
                    }
                },
                {
                    text: 'Отправить на организацию по STOP/VSAT',
                    to: 'start-stop-build',
                    condition: function (user, order) {
                        var access = (order.info.initiator.department._id == user.department._id + '');
                        var income = (order.info['cost-once'] != null && order.info['cost-monthly']);
                        return (order.status == 'client-match' && access && income && order.stop.complete && order.stop.capability);
                    }
                },
                {
                    text: 'Настройка сети завершена',
                    to: 'end-network',
                    condition: function (user, order) {
                        return (order.status == 'network' && user.department.type == 'net');
                    }
                },
                {
                    text: 'Отклонить заявку',
                    to: 'reject',
                    condition: function (user, order) {
                        return ((order.info.initiator.department._id == user.department._id + '' || user.department.type == 'admin') && order.status != 'reject')
                    }
                },
                {
                    text: 'Полностью удалить заявку',
                    to: 'delete',
                    condition: function (user, order) {
                        return (user.department.type == 'admin')
                    }
                },
                {
                    text: 'Поcтавить на паузу',
                    to: 'pause',
                    condition: function (user, order) {
                        return (!order.pause.status && (user.department.type == 'admin' || order.info.initiator.department._id == user.department._id + ''))
                    }
                },
                {
                    text: 'Снять с паузы',
                    to: 'stop-pause',
                    condition: function (user, order) {
                        return (order.pause.status && (user.department.type == 'admin' || order.info.initiator.department._id == user.department._id + ''))
                    }
                }
            ],
            gzp: [
                {
                    text: 'Организация завершена',
                    to: 'end-build',
                    condition: function (user, order) {
                        return ( order.status == 'gzp-build' &&
                            user.department.type == 'gus' &&
                            user.department.cities.indexOf(order.info.city._id) >= 0 );
                    }
                },
                {
                    text: 'Оборудование установлено',
                    to: 'end-install-devices',
                    condition: function (user, order) {
                        return (
                            order.status == 'install-devices' &&
                             user.department.type == 'gus' &&
                            user.department.cities.indexOf(order.info.city._id) >= 0
                        );
                    }
                }
            ],
            stop: [
                {
                    text: 'Организация завершена',
                    to: 'end-build-stop',
                    condition: function (user, order) {
                        return (order.status == 'stop-build' &&
                            user.department.type == 'b2o')
                    }
                }
            ]
        };

        var ret = [];

        if(tab == 'info' && order.info.initiator.department._id == user.department._id + ''
            && order.status == 'client-match') {
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
                        size: 'm',
                        type: 'submit'
                    },
                    text: 'Сохранить информацию о доходах'
                }
            })
        }

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
                                to: item.to,
                                text: item.text
                            },
                            url: `/order/${order.id}/action`
                        },
                        text: item.text
                    }
                })
            }
        })

        if(['info', 'gzp', 'stop'].indexOf(tab) >= 0 && user.department.type == 'admin') {
            ret.push({
                block: 'order',
                elem: 'action',
                content: {
                    block: 'button',
                    mods: {
                        theme: 'islands',
                        size: 'm',
                        type: 'link'
                    },
                    url: `/order/${order.id}/${tab}?admin=1`,
                    text: 'Административная правка'
                }
            })
        }

        if( tab == 'init' ) {
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
                        size: 'm',
                        type: 'submit'
                    },
                    text: 'Инициировать заказ'
                }
            })
        }
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
                            size: 'm',
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
                            size: 'm',
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
                            size: 'm',
                            type: 'submit'
                        },
                        text: 'Проработка завершена'
                    }
                })
            }

        if(adminEdit) {
            ret = [
                {
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
                            size: 'm',
                            type: 'submit'
                        },
                        text: 'Сохранить изменения'
                    }

                }
            ]
        }
        return ret;

})
