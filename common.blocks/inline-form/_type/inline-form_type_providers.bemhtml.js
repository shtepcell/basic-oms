block('inline-form').mod('type', 'providers').elem('controls').def()(function() {
    // TODO: consts.js
    this.ctx.content.unshift(
        {
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
            name: 'type',
            val: 'г.',
            mods: {
                mode: 'radio',
                size: 'm',
                theme: 'islands'
            },
            mix: {
                block: 'inline-form',
                elem: 'provider-type'
            }
        },
        {
            block: 'input',
            placeholder: 'Название провайдера',
            name: 'name',
            mods: {
                theme: 'islands',
                size: 'm'
            },
            mix: {
                block: 'inline-form',
                elem: 'provider-name'
            }
        }
    );

    return applyNext();
});