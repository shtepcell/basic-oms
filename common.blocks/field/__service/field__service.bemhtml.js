block('field').elem('service').content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    const services = ctx.dataset.services;

    if(ctx.display) {
        return [
            {
                block: 'order',
                elem: 'body-row',
                content: [
                    {
                        block: 'order',
                        elem: 'body-row-name',
                        content: 'Услуга'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: services[order.info.service]
                    }
                ]
            }
        ]
    }
})

block('field').elem('service').elemMod('access', true).content()(function () {
    var ctx = this.ctx,
        order = ctx.order;

    const services = ctx.dataset.services;

    const srvs = Object.keys(services).map( (item) => {
        return {
            val: item,
            text: services[item]
        };
    });


    if(ctx.display) {
        return [

            {
                block: 'order',
                elem: 'body-row',
                content: [
                    {
                        block: 'order',
                        elem: 'body-row-name',
                        content: 'Услуга *'
                    },
                    {
                        block: 'order',
                        elem: 'body-row-data',
                        content: [
                            {
                                block: 'select',
                                name: 'service',
                                mix: {
                                    block: 'action',
                                    elem: 'change-service',
                                    js: {
                                        service: order.info.service,
                                        volume: order.info.volume,
                                        ip: order.info.ip,
                                        relation: order.info.relation
                                    }
                                },
                                mods: {
                                    mode: 'radio',
                                    theme: 'islands',
                                    size: 'l'
                                },
                                val: order.info.service,
                                options: srvs
                            }
                        ]
                    }
                ]
            },
        ]
    }
})
