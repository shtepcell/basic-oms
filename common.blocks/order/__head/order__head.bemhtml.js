block('order').elem('head').content()(function () {
    var order = this.ctx.order;
    var pause = '',
        resp = null,
        user = this.ctx.user;

    var services = {
        internet: 'Интернет',
         vpls: 'VPLS',
         l3vpn: 'L3VPN',
         l2vpn: 'L2VPN',
         cloud: 'Облачная АТС',
         digital: 'Цифровые каналы',
         sks: 'СКС',
         sputnik: 'Спутник',
         devices: 'Размещение оборудования',
         phone: 'Телефония (IP-телефония)',
         analog: 'Аналоговые каналы (ТЧ)',
         vibe: 'Волокно',
         wifi: 'Авторизация Wi-Fi',
         iptv: 'IP TV'
    };

    var isInit = (user.department.type == 'b2b' || user.department.type == 'b2o');
    var isAdmin = (user.department.type == 'admin');

    const isOn = (order.status == 'succes');
    const hasVolume = ['internet', 'l2vpn', 'l3vpn', 'vpls'].includes(order.info.service);

    var tContact = order.info.contact,
        tAdress = `${order.info.city.type} ${order.info.city.name}, ${order.info.adds}`,
        tService = `${services[order.info.service]}`,
        tVolume = '';

        if(order.info.volume)
          tVolume = order.info.volume;

        if(order.info.street)
          var tAdress = `${order.info.city.type} ${order.info.city.name}, ${order.info.street.type} ${order.info.street.name}, ${order.info.adds}`

    var textInfo = `
      ${order.id} | [${order.info.client.type.shortName}] ${order.info.client.name} | ${tContact} | ${tAdress} | ${tService} | ${tVolume}
    `;

    if(order.pause.status) pause = ' (на паузе)';
    if(order.requestPause.status) pause = ' (запрос на паузу)';

    if(order.resp != null) {
        resp = {
            elem: 'head-item',
            content: [
                {
                    elem: 'cell-name',
                    content: 'Ответственный за текущий этап отдел'
                },
                {
                    elem: 'cell-data',
                    content: order.resp
                }
            ]
        }
    }

    return [
        {
            elem: 'flag',
            elemMods: {
                color: order.flag
            },
            js: {
                state: order.flag,
                id: order.id
            }
        },
        {
            block: 'button',
            mods: {
                theme: 'islands',
                view: 'plain'
            },
            mix: {
              block: 'order',
              elem: 'clipboard',
              js: {
                str: textInfo
              }
            },
            icon: {
                block: 'icon',
                attrs: {
                  title: 'Нажмите, чтобы скопировать данные'
                },
                url: '/copy.png'
            }
        },
        {
            block : 'link',
            mix: {
              block: 'order',
              elem: 'dublicate',
              elemMods: {
                visible: isInit
              }
            },
            mods : { theme : 'islands', size : 'm' },
            url : `/init?rel=${order.id}`,
            content : 'Дублировать'
        },
        {
            block : 'link',
            mix: {
              block: 'order',
              elem: 'change',
              elemMods: {
                visible: isOn && isInit && hasVolume
              }
            },
            mods : { theme : 'islands', size : 'm' },
            url : `/change-order/${order.id}`,
            content : 'Изменить заказ'
        },
        {
            block: 'dropdown',
            mods: {
                switcher: 'link',
                theme: 'islands',
                size: 'm'
            },
            mix: {
              block: 'order',
              elem: 'direct',
              elemMods: {
                visible: isAdmin
              }
            },
            switcher: {
                block: 'link',
                mods: {
                    pseudo: true,
                    theme: 'islands',
                    size: 'm'
                },
                content: 'Изменить этап'
            },
            popup: {
              block: 'stages',
              id: order.id
            }
        },
        {
            elem: 'head-cell',
            elemMods: {
                type: 'left'
            },
            content: {
                elem: 'id',
                id: order.id
            }
        },
        {
            elem: 'head-cell',
            elemMods: {
                type: 'center'
            },
            content: [
                {
                    elem: 'head-cell',
                    elemMods: {
                        type: 'top'
                    },
                    content: [
                        {
                            elem: 'head-item',
                            content: [
                                {
                                    elem: 'cell-name',
                                    content: 'Этап'
                                },
                                {
                                    elem: 'cell-data',
                                    content: order.stage + pause
                                }
                            ]
                        },
                        resp
                    ]
                },
                {
                    elem: 'head-cell',
                    elemMods: {
                        type: 'bottom'
                    },
                    content: {
                        elem: 'switcher',
                        order: order,
                        tab: this.ctx.tab
                    }

                }
            ]
        },
        {
            elem: 'head-cell',
            elemMods: {
                type: 'right'
            },
            content: {
                elem: 'cs',
                cs: order.cs
            }
        }
    ]
})
