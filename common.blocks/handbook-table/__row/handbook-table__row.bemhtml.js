block('handbook-table').elem('row')(
    content()(function () {
        var content = this.ctx.content;
        console.log('==========ROW==========', content);
        if (!Array.isArray(content))
            content = [].concat(content);

        content.push(
            {
                block: 'handbook-table',
                elem: 'cell',
                content: {
                    block: 'button',
                    text: 'Изменить',
                    mix: [{ block: 'handbook-table', elem: 'chng-btn' }],
                    mods: {
                        theme: 'islands',
                        size: 's'
                    }
                }
            },
            {
                block: 'handbook-table',
                elem: 'cell',
                content: {
                    block: 'button',
                    text: 'Удалить',
                    mix: [{ block: 'handbook-table', elem: 'dlt-btn' }],
                    mods: {
                        theme: 'islands',
                        size: 's'
                    }
                }
            }
        );

        return content;
    }),
    tag()('tr'),
    js()(function() {
        return {
            cellsData: this.ctx.cellsData
        }
    })
);