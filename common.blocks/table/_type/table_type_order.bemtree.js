block('table').mod('type', 'order').content()(function () {
    var ctx = this.ctx,
        params = this.ctx.params,
        ret = [];
    if(ctx.data)
    ctx.data.forEach( item => {
        var dl = '';
        if(item.pause.deadline) dl = item.pause.deadline;

        if(item.deadline != null) {
            var now = new Date();
            now = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
            dl = Math.round((item.deadline - now) / 1000 / 60 / 60 / 24);
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
                    content: item.info.service.name
                },
                {
                    elem: 'cell',
                    content: dl
                },
                {
                    elem: 'cell',
                    content: `${item.info.city.type} ${item.info.city.name}, ${item.info.street}, ${item.info.adds}`
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
