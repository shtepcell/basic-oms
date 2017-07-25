block('inline-form').mod('type', 'services').elem('controls').def()(function() {
    this.ctx.content.unshift(
        {
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
            val: '0',
            mods: {
                mode: 'radio',
                size: 'm',
                theme: 'islands'
            },
            mix: {
                block: 'inline-form',
                elem: 'service-type'
            }
        },
        {
            block: 'input',
            placeholder: 'Название услуги',
            name: 'serviceName',
            mods: {
                theme: 'islands',
                size: 'm'
            },
            mix: {
                block: 'inline-form',
                elem: 'service-name'
            }
        }
    );

    return applyNext();
});