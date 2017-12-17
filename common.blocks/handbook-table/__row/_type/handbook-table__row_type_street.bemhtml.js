block('handbook-table').elem('row').elemMod('type', 'street')(
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

block('handbook-table').elem('row').elemMod('type', 'street').elemMod('edited', true)(
    content()(function() {
        // console.log('========STREET-EDITED===============');
        return [
            {
                block: 'handbook-table',
                elem: 'cell',
                content: {
                    block: 'select',
                    options: [
                        {
                            val: 'ул.',
                            text: 'ул.'
                        },
                        {
                            val: 'пер.',
                            text: 'пер.'
                        },
                        {
                            val: 'бул.',
                            text: 'бул.'
                        },
                        {
                            val: 'кв.',
                            text: 'кв.'
                        },
                        {
                            val: 'пр-т.',
                            text: 'пр-т.'
                        },
                        {
                            val: 'ш.',
                            text: 'ш.'
                        },
                        {
                            val: 'пл.',
                            text: 'пл.'
                        }],
                    name: 'lalalal',
                    val: this.ctx.cellsData.type,
                    mods: {
                        mode: 'radio',
                        size: 's',
                        theme: 'islands'
                    },
                    mix: {
                        block: 'handbook-table',
                        elem: 'street-type'
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
                        elem: 'street-name'
                    },
                    placeholder: 'Город',
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
