block('inline-form').mod('type', 'clients').elem('controls').def()(function() {
    var types = this.ctx.data.clientTypeArr,
        opt = types.map(function(item) {
            return {
                text: item.shortName,
                val: item._id
            };
        });

    this.ctx.content.unshift(
        {
            block: 'select',
            options: opt,
            name: 'type',
            val: types && types.length && types[0]._id,
            mods: {
                mode: 'radio',
                size: 'm',
                theme: 'islands'
            },
            mix: {
                block: 'inline-form',
                elem: 'client-type'
            }
        },
        {
            block: 'input',
            placeholder: 'Название клиента',
            name: 'name',
            mods: {
                theme: 'islands',
                size: 'm'
            },
            mix: {
                block: 'inline-form',
                elem: 'client-name'
            }
        }
    );

    return applyNext();
});
