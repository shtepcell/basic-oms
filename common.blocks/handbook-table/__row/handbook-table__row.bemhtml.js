block('handbook-table').elem('row')(
    content()(function () {
        var content = this.ctx.content;
        if (!Array.isArray(content))
            content = [].concat(content);

        content.push(
            {
                block: 'handbook-table',
                elem: 'cell',
                content: 'Изменить'
            },
            {
                block: 'handbook-table',
                elem: 'cell',
                content: 'Удалить'
            }
        );

        return content;
    }),
    tag()('tr')
);
