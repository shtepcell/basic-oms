block('order').elem('action').elemMod('type', 'redirect').replace()(function () {
    var ctx = this.ctx,
        deps = ctx.deps,
        options = [];

    for (var i = 0; i < deps.length; i++) {
        if (deps[i].type == 'gus' || deps[i].type == 'rrl')
            options.push({
                val: deps[i].name,
                text: deps[i].name
            })
    }
    if(ctx.display)
    return {
        block: 'select',
        mix: {
            block: 'action',
            elem: 'redirect-to',
            js: {
                id: ctx.id
            }
        },
        mods: {
            mode: 'radio-check',
            theme: 'islands',
            size: 'm'
        },
        name: 'select3',
        text: 'Изменить зону ответсвенности',
        options: options
    }
})
