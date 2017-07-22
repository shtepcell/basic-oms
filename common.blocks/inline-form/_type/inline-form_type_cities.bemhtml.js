block('inline-form').mod('type', 'cities').elem('controls').def()(function() {
    this.ctx.content.unshift(
        {
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
                elem: 'city-type'
            }
        },
        {
            block: 'input',
            placeholder: 'Название города',
            name: 'name',
            mods: {
                theme: 'islands',
                size: 'm'
            },
            mix: {
                block: 'inline-form',
                elem: 'city-name'
            }
        }
    );

    return applyNext();
});