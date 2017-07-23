block('handbook-table').elem('row').elemMod('type', 'services')(
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

block('handbook-table').elem('row').elemMod('type', 'services').elemMod('edited', true)(
    content()(function() {
        return [
            {
                block: 'handbook-table',
                elem: 'cell',
                content: {
                    block: 'select',
                    options: [
                        {
                            val: '0',
                            text: '0'
                        },
                        {
                            val: '1',
                            text: '1'
                        }, 
                        {
                            val: '2',
                            text: '2'
                        }, 
                        {
                            val: '3',
                            text: '3'
                        }
                    ],
                    name: 'serviceType',
                    val: this.ctx.cellsData.type,
                    mods: {
                        mode: 'radio',
                        size: 's',
                        theme: 'islands'
                    },
                    mix: {
                        block: 'handbook-table',
                        elem: 'service-type'
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
                        elem: 'service-name'
                    },
                    placeholder: 'Название услуги',
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