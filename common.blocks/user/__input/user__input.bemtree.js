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
                mode: 'radio',
                theme: 'islands',
                size: 'm'
            },
            val: (ctx.val && ctx.val=='')?ctx.data[0].val:ctx.val,
            name: 'department',
            options: ctx.data
        }
    }

    return inputs[ctx.type];
})
