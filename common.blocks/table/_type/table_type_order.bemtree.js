block('table').mod('type', 'order').content()(function () {
    var ctx = this.ctx,
        params = this.ctx.params,
        ret = [];

    var services = this.data.locals.dataset.services;

    if(ctx.data)
    ctx.data.forEach( item => {
        var dl = '';

        if(item.pause)
            if(item.pause.deadline) dl = item.pause.deadline;

        if(item.deadline != null) {
            var now = new Date();
            now = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
            dl = Math.round((item.deadline - now) / 1000 / 60 / 60 / 24);
        }

        var adress;

        if(item.isOld)
            adress = `${item.info.adds}`;
        else {
            adress = `${item.info.city.type} ${item.info.city.name}, `;
            adress += (item.info.coordinate)?`${item.info.coordinate}`:`${item.info.street.type}${item.info.street.name}, ${item.info.adds}`;
        }


        ret.push({
            elem: 'row',
            mix: {
                block: 'action',
                elem: 'redirect',
                js: {
                    url: `/order/${item.id}/info`
                }
            },
            content: [
                {
                    elem: 'cell',
                    content: '#'+item.id
                },
                {
                    elem: 'cell',
                    content: `[${item.info.client.type.shortName}] ${item.info.client.name}`
                },
                {
                    elem: 'cell',
                    content: item.status
                },
                {
                    elem: 'cell',
                    content: services[item.info.service]
                },
                {
                    elem: 'cell',
                    content: dl
                },
                {
                    elem: 'cell',
                    content: `${adress}`
                }
            ]
        })
    })

    var clms = [
        {
            text: 'ID',
            name: 'id'
        },
        {
            text: 'Клиент',
            name: 'client'
        },
        {
            text: 'Статус',
            name: 'status'
        },
        {
            text: 'Услуга',
            name: 'service'
        },
        {
            text: 'КС',
            name: 'deadline'
        },
        {
            text: 'Адрес',
            name: 'adress'
        }
    ];

    var hdr = [];

    clms.forEach( it => {
        var icon = {};
        var flag = (it.name == params.sort)?params.value:0;

        switch (flag) {
            case '1':
                icon = {
                    block: 'icon',
                    url: '/down-arrow.png'
                }
                break;
            case '-1':
                icon = {
                    block: 'icon',
                    url: '/up-arrow.png'
                }
                break;
        }

        hdr.push({
            block: 'olololo',
            mix: {
                block: 'action',
                elem: 'add-params',
                js: {
                    params: {
                        sort: it.name,
                        value: (it.name == params.sort)?-1*params.value:1
                    }
                }
            },
            name: it.name,
            content: [
                it.text,
                icon
            ]
        })
    })

    return [
        {
            elem: 'head',
            columns: hdr
        },
        {
            elem: 'body',
            content: ret
        }
    ]

})
