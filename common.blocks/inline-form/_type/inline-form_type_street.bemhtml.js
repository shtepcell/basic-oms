block('inline-form').mod('type', 'street').elem('controls').def()(function() {
    this.ctx.content.unshift(
        {
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
                    val: 'наб.',
                    text: 'наб.'
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
            name: 'type',
            val: 'г.',
            mods: {
                mode: 'radio',
                size: 'm',
                theme: 'islands'
            },
            mix: {
                block: 'inline-form',
                elem: 'street-type'
            }
        },
        {
            block: 'input',
            placeholder: 'Название улицы',
            name: 'name',
            mods: {
                theme: 'islands',
                size: 'm'
            },
            mix: {
                block: 'inline-form',
                elem: 'street-name'
            }
        }
    );

    return applyNext();
});
