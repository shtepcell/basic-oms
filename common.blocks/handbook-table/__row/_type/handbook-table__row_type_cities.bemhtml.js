block('handbook-table').elem('row').elemMod('type', 'cities')(
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

block('handbook-table').elem('row').elemMod('type', 'cities').elemMod('edited', true)(
    content()(function() {
        console.log('========CITIES-EDITED===============');
        return [
            {
                block: 'handbook-table',
                elem: 'cell',
                content: {
                    block: 'select',
                    options: [
                        {
                            val: 'г.',
                            text: 'г.'
                        },
                        {
                            val: 'пгт.',
                            text: 'пгт.'
                        },
                        {
                            val: 'с.',
                            text: 'с.'
                        },
                        {
                            val: 'пос.',
                            text: 'пос.'
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
                        elem: 'city-type'
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
                        size: 's',
                        width: 'available'
                    },
                    mix: {
                        block: 'handbook-table',
                        elem: 'city-name'
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
