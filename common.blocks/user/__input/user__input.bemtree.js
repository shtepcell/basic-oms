block('user').elem('input').content()(function () {
    var ctx = this.ctx,
        val = ctx.val,
        name = ctx.name;

    var inputs = {
        'text': {
            block: 'input',
            mods: {
                theme: 'islands',
                size: 'm',
                width: 'available'
            },
            placeholder: ctx.placeholder,
            name: name,
            val: val
        },
        'password': {
            block: 'input',
            mods: {
                theme: 'islands',
                size: 'm',
                type: 'password',
                width: 'available'
            },
            placeholder: ctx.placeholder,
            name: name
        },
        'select': {
            block: 'select',
            mods: {
                mode: (ctx.multi)?'check':'radio',
                theme: 'islands',
                size: 'm'
            },
            text: '-',
            val: (ctx.val && ctx.val=='')?'':ctx.val,
            name: ctx.name,
            options: ctx.data
        },
        'checkbox': {
            block: 'checkbox',
            mods: {
                theme: 'islands',
                size: 'm',
                checked: ctx.val
            },
            name: ctx.name,
            val: '1',
            text: ctx.placeholder
        }
    }

    return inputs[ctx.type];
})
