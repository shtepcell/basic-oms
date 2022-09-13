block('field').elem('provider').content()((node, { order, display }) => {
    const { type, name } = order.stop.provider || {};
    let providerString = 'Нет данных';

    if (!display) return;

    if (type && name) {
        providerString = `[${type}] ${name}`;
    }

    return [
        {
            block: 'order',
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Провайдер'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: providerString
                }
            ]
        }
    ];
})

block('field').elem('provider').elemMod('access', true).content()((node, { order, dataset, display }) => {
    if (!display) return;

    const providerExist = order && order.stop && order.stop.provider;

    return [
        {
            block: 'order',
            elem: 'body-row',
            content: [
                {
                    block: 'order',
                    elem: 'body-row-name',
                    content: 'Провайдер *'
                },
                {
                    block: 'order',
                    elem: 'body-row-data',
                    content: [
                        {
                            block : 'suggest',
                            mods : {
                                theme : 'islands',
                                size : 'l',
                                'has-dataprovider' : 'adress'
                            },
                            val: (providerExist) ? order.stop.provider.name : '',
                            placeholder: 'Провайдер',
                            name: 'provider',
                            dataprovider: {
                                data: dataset['providers']
                            }
                        }
                    ]
                }
            ]
        }
    ];

})
