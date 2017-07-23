block('handbook-table').elem('row').elemMod('type', 'client-types')(
    def()(function() {
        var content = this.ctx.content;

        if (!Array.isArray(content))
            content = [].concat(content);

        content.push(
            {
                block: 'handbook-table',
                elem: 'cell',
                content: this.ctx.cellsData.shortName
            }, 
            {
                block: 'handbook-table',
                elem: 'cell',
                content: this.ctx.cellsData.name
            }
        );

        this.ctx.content = content;

        return applyNext();
    })
);

block('handbook-table').elem('row').elemMod('type', 'client-types').elemMod('edited', true)(
    content()(function() {
        return [
            {
                block: 'handbook-table',
                elem: 'cell',
                content: {
                    block: 'input',
                    name: 'lalalal',
                    val: this.ctx.cellsData.shortName,
                    placeholder: 'Аббревиатура',
                    mods: {
                        size: 's',
                        theme: 'islands'
                    },
                    mix: {
                        block: 'handbook-table',
                        elem: 'client-type-short-name'
                    }
                }
            },
            {
                block: 'handbook-table',
                elem: 'cell',
                content: {
                    block: 'input',
                    mods: {
                        theme: 'islands',
                        size: 's'
                    },
                    mix: {
                        block: 'handbook-table',
                        elem: 'client-type-name'
                    },
                    placeholder: 'Название типа',
                    val: this.ctx.cellsData.name
                }
            },
            {
                block: 'handbook-table',
                elem: 'cell',
                content: {
                    block: 'button',
                    text: 'Сохранить',
                    mix: [{ block: 'handbook-table', elem: 'save-chng' }],
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
                    text: 'Отмена',
                    mix: [{ block: 'handbook-table', elem: 'cancel-chng' }],
                    mods: {
                        theme: 'islands',
                        size: 's'
                    }
                }
            }
        ];
    })
);