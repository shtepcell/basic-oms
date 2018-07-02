block('orders-table').elem('body')(
    content()(function () {
        var ctx = this.ctx,
            orders = ctx.orders,
            flags = ctx.flags,
            services = ctx.services;


        var dom = [];
        if(orders.length > 0) {
            for (var i = 0; i < orders.length; i++) {
                var adress,
                    pause;
                if (orders[i].pause) {
                    pause = orders[i].pause.status;
                }
                if(orders[i].isOld && !orders[i].info.street)
                    adress = `${orders[i].info.adds}`;
                else {
                    adress = `${orders[i].info.city.type} ${orders[i].info.city.name}, `;
                    adress += (orders[i].info.coordinate)?`${orders[i].info.coordinate}`:`${orders[i].info.street.type}${orders[i].info.street.name}, ${orders[i].info.adds}`;
                }
                orders[i].info.service = services[orders[i].info.service];
                dom.push({
                    block: 'orders-table',
                    elem: 'tr',
                    url: orders[i].id,
                    flag: flags[orders[i].id],
                    elemMods: {
                        pause: pause
                    },
                    content: [
                        {
                            block: 'orders-table',
                            elem: 'td',
                            elemMods: {
                                type: 'id'
                            },
                            content: [
                                {
                                    block: 'orders-table',
                                    elem: 'flag',
                                    elemMods: {
                                        color: flags[orders[i].id],
                                    },
                                    js: {
                                        state: flags[orders[i].id],
                                        id: orders[i].id
                                    }
                                },
                                {
                                    block: 'orders-table',
                                    elem: 'id',
                                    content: orders[i].id
                                }
                            ]
                        },
                        {
                            block: 'orders-table',
                            elem: 'td',
                            elemMods: {
                                type: 'client'
                            },
                            attrs: {
                                title: orders[i].info.client.name
                            },
                            content: {
                                tag: 'div',
                                content: orders[i].info.client.name
                            }
                        },
                        {
                            block: 'orders-table',
                            elem: 'td',
                            elemMods: {
                                type: 'status'
                            },
                            content: orders[i].status
                        },
                        {
                            block: 'orders-table',
                            elem: 'td',
                            elemMods: {
                                type: 'service'
                            },
                            content: orders[i].info.service
                        },
                        {
                            block: 'orders-table',
                            elem: 'td',
                            elemMods: {
                                type: 'adress'
                            },
                            content: adress
                        },
                        {
                            block: 'orders-table',
                            elem: 'td',
                            elemMods: {
                                type: 'cs',
                                warning: (orders[i].cs < 0)
                            },
                            content: orders[i].cs
                        }
                    ]

                })
            }
        }
        return dom;
    })
)
