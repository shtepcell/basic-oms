block('admin-settings').content()(({ block }, { settings }) => {
    const getTexts = (type) => ({
        'auto-deadline': {
            label: 'Автоматический контрольный срок производства',
            placeholder: 'Кол-во рабочих дней'
        }
    }[type] || { label: type, placeholder: type});

    const settingsReducer = ({ type, data }) => ({
        block,
        elem: 'field',
        content: [
            {
                elem: 'label',
                content: getTexts(type).label
            },
            {
                block: 'input',
                name: type,
                mix: {
                    block,
                    elem: 'input'
                },
                mods: {
                    width: 'available',
                    theme: 'islands',
                    size: 'l'
                },
                maxLength: 2,
                val: data,
                placeholder: getTexts(type).placeholder,
                autocomplete: false,
            }
        ]
    });

    return [
        {
            block,
            elem: 'header',
            content: 'Настройки СУЗа'
        },
        {
            block,
            elem: 'form',
            attrs: {
                name: 'settings-form'
            },
            content: [
                settings.map(settingsReducer),
                {
                    block: 'button',
                    mix: {
                        block,
                        elem: 'submit'
                    },
                    mods: {
                        theme: 'islands',
                        size: 'l',
                        view: 'action',
                        type: 'submit'
                    },
                    text: 'Сохранить'
                }
            ]
        },
    ];
})