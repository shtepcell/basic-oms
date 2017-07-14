block('handbook-table').elem('head-row')(
    content()(function () {
        var content = this.ctx.content;
        if (!Array.isArray(content))
            content = [].concat(content);

        content.push(
            {
                block: 'handbook-table',
                elem: 'cell',
                content: ' '
            },
            {
                block: 'handbook-table',
                elem: 'cell',
                content: ' '
            }
        );

        return content;
    }),
    tag()('tr')
);