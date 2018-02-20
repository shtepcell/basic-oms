block('table').mod('type', 'notify').content()(function () {
    var ctx = this.ctx,
        ret = [];

    ctx.data.forEach( item => {
        ret.push({
            elem: 'row',
            mix: [
                {
                    block: 'action',
                    elem: 'read-notify',
                    js: {
                        url: `/notifies/${item.id}`
                    }
                },
                {
                    block: 'table',
                    elem: (item.read)?'':'row-unread'
                }
            ],
            content: [
                {
                    elem: 'cell',
                    content: item.text
                },
                {
                    elem: 'cell',
                    content: '#'+item.order
                },
                {
                    elem: 'cell',
                    content: item.date
                }
            ]
        })
    })
    return [
        {
            elem: 'head',
            columns: ['Событие', 'ID заказа', 'Время и дата']
        },
        {
            elem: 'body',
            content: ret
        }
    ]

})
