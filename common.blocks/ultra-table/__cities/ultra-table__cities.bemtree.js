block('ultra-table').elem('cities').content()(function() {
    var _data = this.ctx.data;

    var content = _data.map( item => {
        return {
            tag: 'tr',
            content: [
                {
                    tag: 'td',
                    content: `${item.type} ${item.name}`
                },
                {
                    tag: 'td',
                    content: {
                        block: 'button',
                        mods: {
                            size: 's',
                            theme: 'islands'
                        },
                        mix: {
                            block: 'ultra-table',
                            elem: 'delete',
                            js: {
                                _id: item._id
                            }
                        },
                        text: 'Удалить',

                    }
                }
            ]
        }
    })

    return [
        {
            tag: 'tbody',
            content: content
        }
    ];
});
