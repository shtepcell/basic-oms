block('handbook-table').elem('row').elemMod('type', 'providers')(
    def()(function() {
        var content = this.ctx.content;

        if (!Array.isArray(content))
            content = [].concat(content);

        content.push(
            {
                block: 'handbook-table',
                elem: 'cell',
                content: this.ctx.cellsData.type
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

block('handbook-table').elem('row').elemMod('type', 'providers').elemMod('edited', true)(
    // TODO: consts.js
    content()(function() {
        return [
            {
                block: 'handbook-table',
                elem: 'cell',
                content: {
                    block: 'select',
                    options: [
                        {
                            val: 'STOP',
                            text: 'STOP'
                        },
                        {
                            val: 'WSAT',
                            text: 'WSAT'
                        }
                    ],
                    name: 'providersType',
                    val: this.ctx.cellsData.type,
                    mods: {
                        mode: 'radio',
                        size: 's',
                        theme: 'islands'
                    },
                    mix: {
                        block: 'handbook-table',
                        elem: 'providers-type'
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
                        elem: 'providers-name'
                    },
                    placeholder: 'Название провайдера',
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