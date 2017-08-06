block('handbook-table').elem('row').elemMod('type', 'clients')(
    def()(function() {
        var content = this.ctx.content;

        if (!Array.isArray(content))
            content = [].concat(content);

        content.push(
            {
                block: 'handbook-table',
                elem: 'cell',
                content: '[' + this.ctx.cellsData.type.shortName + ']'
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

block('handbook-table').elem('row').elemMod('type', 'clients').elemMod('edited', true)(
    // TODO: consts.js
    content()(function() {
        var clientTypes = [],
            opt = [];

        this.ctx.blockParams.forEach(function(item) {
            clientTypes.push(item);
            opt.push({
                val: item._id,
                text: item.shortName
            });
        });

        return [
            {
                block: 'handbook-table',
                elem: 'cell',
                content: {
                    block: 'select',
                    options: opt,
                    name: 'providersType',
                    val: this.ctx.cellsData.type._id,
                    mods: {
                        mode: 'radio',
                        size: 's',
                        theme: 'islands'
                    },
                    mix: {
                        block: 'handbook-table',
                        elem: 'clients-type'
                    },
                    js: {
                        clientTypes: clientTypes
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
                        elem: 'clients-name'
                    },
                    placeholder: 'Название клиента',
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