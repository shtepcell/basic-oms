block('inline-form').mod('type', 'client-types').elem('controls').def()(function() {
    this.ctx.content.unshift(
        {
            block: 'input',
            placeholder: 'Аббревиатура',
            name: 'shortName',
            mods: {
                theme: 'islands',
                size: 'm'
            },
            mix: {
                block: 'inline-form',
                elem: 'client-type-short-name'
            }
        },
        {
            block: 'input',
            placeholder: 'Название типа клиента',
            name: 'name',
            mods: {
                theme: 'islands',
                size: 'm'
            },
            mix: {
                block: 'inline-form',
                elem: 'client-type-name'
            }
        }
    );

    return applyNext();
});